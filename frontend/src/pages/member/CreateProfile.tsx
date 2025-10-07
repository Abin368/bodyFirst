import { observer } from 'mobx-react-lite'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { memberStore } from '@/store/memberStore'
import { MemberProfileSchema, type MemberProfileFormValues } from '@/schemas/member'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { MemberService } from '@/services/memberService'
import { Toast } from '@/components/common/Toast'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const CreateProfile = observer(() => {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tempImageKey, setTempImageKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [showToast, setShowToast] = useState(false)

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberProfileFormValues>({
    resolver: zodResolver(MemberProfileSchema),
    defaultValues: {
      contactNo: '',
      address: {
        street: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
      },
      gender: 'MALE',
      age: 18,
      heightCm: 170,
      weightKg: 60,
      activityLevel: 'BEGINNER',
      images: [],
    },
  })

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
      setCropModalOpen(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
  }

  const handleUploadCroppedImage = async () => {
    if (!imageFile || !croppedAreaPixels) return
    setLoading(true)
    try {
      const croppedBlob = await getCroppedImg(imageFile, croppedAreaPixels)
      const formData = new FormData()
      formData.append('file', croppedBlob)
      const { key, url } = await MemberService.uploadProfileImage(formData)
      console.log(url)
      setTempImageKey(key)
      setPreviewUrl(URL.createObjectURL(croppedBlob))
      setCropModalOpen(false)
      setImageFile(null)
      showToastMessage('Image uploaded successfully!', 'success')
    } catch (err) {
      console.error(err)
      showToastMessage('Image upload failed!', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelCrop = () => {
    setCropModalOpen(false)
    setImageFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const onSubmit = async (data: MemberProfileFormValues) => {
    if (!tempImageKey) {
      showToastMessage('Please upload and crop your profile image.', 'error')
      return
    }
    setLoading(true)
    try {
      const payload = { ...data, tempImageKey }
      const { message } = await memberStore.createProfile(payload)
      await memberStore.fetchMemberProfile()

      showToastMessage(message, 'success')
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message)
      const errorMsg = err?.response?.data?.message || 'Failed to create profile. Try again.'

      showToastMessage(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {loading && (
        <LoadingOverlay
          message={cropModalOpen ? 'Uploading image...' : 'Creating your profile...'}
        />
      )}

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Let's get you started on your fitness journey</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-8 md:p-10 space-y-8">
            {/* Profile Image Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <Label className="block text-lg font-bold text-gray-900 mb-4">Profile Image</Label>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* File Input */}
                <div className="flex-1">
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Choose Image
                    </div>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max. 5MB)</p>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                Personal Information
              </h3>
              {error && <p className="text-red-500 text-center font-medium mt-2">{error}</p>}

              {/* Contact Number */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number
                </Label>
                <Input
                  {...register('contactNo')}
                  placeholder="Enter your contact number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                />
                {errors.contactNo && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.contactNo.message}
                  </p>
                )}
              </div>

              {/* Gender, Age, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Gender</Label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 transition-all duration-300 bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Age</Label>
                  <Input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    min={1}
                    max={120}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    {...register('weightKg', { valueAsNumber: true })}
                    min={1}
                    max={200}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    {...register('heightCm', { valueAsNumber: true })}
                    min={1}
                    max={200}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Street</Label>
                  <Input
                    {...register('address.street')}
                    placeholder="123 Fitness Lane"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                  />
                  {errors.address?.street && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address.street.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">City</Label>
                  <Input
                    {...register('address.city')}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                  />
                  {errors.address?.city && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">District</Label>
                  <Input
                    {...register('address.district')}
                    placeholder="Kannur"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                  />
                  {errors.address?.district && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address.district.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">State</Label>
                  <Input
                    {...register('address.state')}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                  />
                  {errors.address?.state && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</Label>
                  <Input
                    {...register('address.pincode')}
                    placeholder="400001"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300"
                  />
                  {errors.address?.pincode && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fitness Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                Fitness Details
              </h3>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Level
                </Label>
                <select
                  {...register('activityLevel')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-gray-900 transition-all duration-300 bg-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Cropping Modal */}
      {cropModalOpen && imageFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Crop Your Image</h3>
              <p className="text-indigo-100 text-sm mt-1">Adjust the image to your liking</p>
            </div>
            <div className="p-6">
              <div className="relative h-[400px] w-full bg-gray-900 rounded-2xl overflow-hidden">
                <Cropper
                  image={URL.createObjectURL(imageFile)}
                  crop={crop}
                  zoom={zoom}
                  cropShape="rect"
                  aspect={undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button
                type="button"
                onClick={handleCancelCrop}
                variant="secondary"
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUploadCroppedImage}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} type={toastType} show={showToast} />
    </div>
  )
})

export default CreateProfile
