import { observer } from "mobx-react-lite"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ownerStore } from "@/store/ownerStore"
import { GymSchema, type GymFormValues } from "@/schemas/gym"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const CreateGym = observer(() => {
  const [loading, setLoading] = useState<boolean>(false)

  const { register, handleSubmit, formState: { errors } } = useForm<GymFormValues>({
    resolver: zodResolver(GymSchema),
    defaultValues: {
      name: "",
      contactNo: "",
      website: "",
      address: { street: "", city: "", state: "", pincode: "" },
      images: [],
      services: [],
    },
  })

  const onSubmit = async (data: GymFormValues) => {
    setLoading(true)
    try {
      // await ownerStore.createGym(data)
      await ownerStore.fetchProfile()
      console.log("Gym Created", data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 transform transition-all duration-500 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-up">
            Launch Your Gym with BodyFirst
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto animate-fade-in-up animate-delay-200">
            Create a standout gym profile to attract members and streamline your operations effortlessly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Gym Name */}
          <div>
            <Label className="block text-sm font-semibold text-gray-800 mb-2">Gym Name</Label>
            <Input
              {...register("name")}
              placeholder="Enter your gym's name"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.name.message}</p>
            )}
          </div>

          {/* Contact & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-800 mb-2">Contact Number</Label>
              <Input
                {...register("contactNo")}
                placeholder="1234567890"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.contactNo.message}</p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-800 mb-2">Website (Optional)</Label>
              <Input
                {...register("website")}
                placeholder="https://yourgym.com"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2">Gym Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">Street</Label>
                <Input
                  {...register("address.street")}
                  placeholder="123 Fitness Lane"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.address.street.message}</p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">City</Label>
                <Input
                  {...register("address.city")}
                  placeholder="Mumbai"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.address.city.message}</p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">State</Label>
                <Input
                  {...register("address.state")}
                  placeholder="Maharashtra"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.address.state.message}</p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-800 mb-2">Pincode</Label>
                <Input
                  {...register("address.pincode")}
                  placeholder="400001"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none text-base"
                />
                {errors.address?.pincode && (
                  <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.address.pincode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <Label className="block text-sm font-semibold text-gray-800 mb-2">Gallery Images (Comma-separated URLs)</Label>
            <Textarea
              {...register("images")}
              placeholder="https://img1.com, https://img2.com"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none resize-none text-base"
              rows={4}
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.images.message}</p>
            )}
          </div>

          {/* Services */}
          <div>
            <Label className="block text-sm font-semibold text-gray-800 mb-2">Services (Comma-separated)</Label>
            <Textarea
              {...register("services")}
              placeholder="Gym, Pool, Yoga, Personal Training"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none resize-none text-base"
              rows={4}
            />
            {errors.services && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.services.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Gym"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
})

export default CreateGym

