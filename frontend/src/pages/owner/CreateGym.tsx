import { observer } from 'mobx-react-lite'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ownerStore } from '@/store/ownerStore'
import { GymSchema, type GymFormValues } from '@/schemas/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { OwnerService } from '@/services/ownerService'
import { Toast } from '@/components/common/Toast'
import LoadingOverlay from '@/components/common/LoadingOverlay'


const CreateGym = observer(() => {
  const [loading, setLoading] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
 
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false)
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tempImageKey, setTempImageKey] = useState<string | null>(null)
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
  } = useForm<GymFormValues>({
    resolver: zodResolver(GymSchema),
    defaultValues: {
      name: '',
      contactNo: '',
      website: '',
      address: { street: '', city: '', state: '', pincode: '' },
      images: [],
      services: [],
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
      const { key, url } = await OwnerService.uploadGymImage(formData)
      console.log(url)
      setTempImageKey(key)
      setPreviewUrl(URL.createObjectURL(croppedBlob))
      setCropModalOpen(false)
      setImageFile(null)
      showToastMessage('Image uploaded successfully!', 'success')
    } catch (err) {
      console.error('Image upload failed', err)
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

  const onSubmit = async (data: GymFormValues) => {
    if (!tempImageKey) {
      showToastMessage('Please upload and crop your gym image.', 'error')
      return
    }
    setLoading(true)
    try {
      const payload = { ...data, tempImageKey }
      await ownerStore.createGym(payload)
      await ownerStore.fetchProfile()
      showToastMessage('Gym created successfully!', 'success')
    } catch (err) {
      console.error(err)
      showToastMessage('Failed to create gym. Try again.', 'error')
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
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Full-page loading overlay */}
      {loading && (
        <LoadingOverlay message={cropModalOpen ? 'Uploading image...' : 'Creating your gym...'} />
      )}

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 transform transition-all duration-500 hover:shadow-3xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-up">
            Build Your Gym Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto animate-fade-in-up animate-delay-200">
            Showcase your gym on BodyFirst and attract members with a stunning profile.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Gym Name */}
          <div>
            <Label className="block text-sm font-semibold text-gray-800 mb-2">Gym Name</Label>
            <Input
              {...register('name')}
              placeholder="Enter your gym's name"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.name.message}</p>
            )}
          </div>

          {/* Contact and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-800 mb-2">
                Contact Number
              </Label>
              <Input
                {...register('contactNo')}
                placeholder="1234567890"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">
                  {errors.contactNo.message}
                </p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-800 mb-2">
                Website (Optional)
              </Label>
              <Input
                {...register('website')}
                placeholder="https://yourgym.com"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2">
              Gym Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">Street</Label>
                <Input
                  {...register('address.street')}
                  placeholder="123 Fitness Lane"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">City</Label>
                <Input
                  {...register('address.city')}
                  placeholder="Mumbai"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">State</Label>
                <Input
                  {...register('address.state')}
                  placeholder="Maharashtra"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">Pincode</Label>
                <Input
                  {...register('address.pincode')}
                  placeholder="400001"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.pincode && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">
                    {errors.address.pincode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gym Image */}
          <div>
            <Label className="block text-sm font-semibold text-gray-800 mb-2">Gym Image</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-600 hover:file:bg-indigo-200 transition-all duration-300"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Gym Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Cropping Modal */}
          {cropModalOpen && imageFile && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Crop Your Gym Image</h3>
                <div className="relative h-[400px] w-full bg-gray-100 rounded-lg overflow-auto">
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
                <div className="mt-4 flex justify-between">
                  <Button
                    type="button"
                    onClick={handleCancelCrop}
                    variant="secondary"
                    className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUploadCroppedImage}
                    disabled={loading}
                    className="py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Gym
          </Button>

          {/* Toast */}
          <Toast message={toastMessage} type={toastType} show={showToast} />
        </form>
      </div>
    </div>
  )
})

export default CreateGym
