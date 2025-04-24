"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MaterialChip } from "./material-chip"
import { cn } from "@/lib/utils"

// Types
interface Material {
  id: number
  name: string
  color: string
}

interface MaterialTypes {
  general: Material[]
  hazardous: Material[]
  specialized: Material[]
}

interface MaterialPricing {
  materialType: string
  measure: string
  defaultRate: string
  minCharge: string
  freeTonnage: number
  overageCharge: string
  overageThreshold: number
  freeTonnageUnits?: string
}

interface DisposalFee {
  id?: number
  name: string
  description: string
  measure: string
  defaultRate: string
  minCharge: string
  overageCharge: string
  overageThreshold: number
  freeTonnage: number
  glCode: string
  materials?: string[]
  materialPricing?: MaterialPricing[]
}

interface DisposalFeeFormProps {
  initialFee?: DisposalFee
  onSave: (fee: DisposalFee) => void
  onCancel: () => void
}

// Mock data
const materials: Material[] = [
  { id: 1, name: "MSW", color: "bg-blue-200 text-black" },
  { id: 2, name: "Recycling", color: "bg-green-200 text-black" },
  { id: 3, name: "C&D", color: "bg-cyan-100 text-black" },
  { id: 4, name: "Mattress", color: "bg-purple-200 text-black" },
  { id: 5, name: "Mate88", color: "bg-purple-300 text-black" },
  { id: 6, name: "Mat34", color: "bg-pink-200 text-black" },
  { id: 7, name: "No Sort Recycle", color: "bg-rose-200 text-black" },
  { id: 8, name: "Appliance", color: "bg-orange-200 text-black" },
  { id: 9, name: "Tire", color: "bg-yellow-200 text-black" },
  { id: 10, name: "Brush", color: "bg-indigo-100 text-black" },
  { id: 11, name: "Shingles", color: "bg-gray-500 text-white" },
  { id: 12, name: "Friable Asbestos", color: "bg-yellow-100 text-black" },
  { id: 13, name: "Non-Friable Asbestos", color: "bg-yellow-200 text-black" },
]
const serviceMeasures = [
  { id: 1, name: "Per Ton", description: "Charged per ton of material" },
  { id: 2, name: "Per Cubic Yard", description: "Charged per cubic yard of material" },
  { id: 3, name: "Per Item", description: "Charged per item" },
  { id: 4, name: "Per Container", description: "Charged per container" },
  { id: 5, name: "Per Day", description: "Charged per day" },
  { id: 6, name: "Per Move", description: "Charged per move or relocation" },
]

const glCodes = [
  { id: 1, code: "4100-DISP", description: "Disposal Revenue" },
  { id: 2, code: "4100-DISP-CD", description: "C&D Disposal Revenue" },
  { id: 3, code: "4100-DISP-REC", description: "Recycling Revenue" },
  { id: 4, code: "4100-DISP-YW", description: "Yard Waste Revenue" },
  { id: 5, code: "4100-DISP-HZ", description: "Hazardous Waste Revenue" },
  { id: 6, code: "4200-ROLL-DEL", description: "Roll-off Delivery Revenue" },
  { id: 7, code: "4200-ROLL-PU", description: "Roll-off Pickup Revenue" },
  { id: 8, code: "4200-ROLL-RENT", description: "Roll-off Rental Revenue" },
  { id: 9, code: "4200-ROLL-OW", description: "Roll-off Overweight Revenue" },
  { id: 10, code: "4200-ROLL-RELOC", description: "Roll-off Relocation Revenue" },
  { id: 11, code: "4200-ROLL-CONT", description: "Roll-off Contamination Revenue" },
]

const descriptionTemplates = [
  { id: 1, text: "Standard disposal fee for [material] waste" },
  { id: 2, text: "Processing fee for [material] materials" },
  { id: 3, text: "[material] disposal fee for [business] customers" },
  { id: 4, text: "Regulatory compliance fee for [material] disposal" },
  { id: 5, text: "Environmental fee for [material] processing" },
]

export function DisposalFeeForm({ initialFee, onSave, onCancel }: DisposalFeeFormProps) {
  // Form state
  const [formData, setFormData] = useState<DisposalFee>(
    initialFee || {
      name: "",
      description: "",
      measure: "Per Ton",
      defaultRate: "",
      minCharge: "",
      overageCharge: "",
      overageThreshold: 0,
      freeTonnage: 0,
      glCode: "",
      materials: [],
    },
  )

  // UI state
  const [useMaterialPricing, setUseMaterialPricing] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [materialPricing, setMaterialPricing] = useState<
    Record<
      string,
      {
        defaultRate: string
        minCharge: string
        freeTonnage: number
        measure: string
        overageThreshold: number
        overageCharge: string
      }
    >
  >({})
  const [errors, setErrors] = useState<Record<string, string>>({
    materialPricing: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false)

  // Initialize form data from initialFee
  useEffect(() => {
    if (initialFee) {
      // Set selected materials
      if (initialFee.materials && initialFee.materials.length > 0) {
        setSelectedMaterials(initialFee.materials)
      } else if (initialFee.material) {
        setSelectedMaterials([initialFee.material])
      }

      // Set material-specific pricing
      const pricing: Record<string, any> = {}
      if (initialFee.materialPricing && initialFee.materialPricing.length > 0) {
        setUseMaterialPricing(true)
        initialFee.materialPricing.forEach((mp) => {
          if (mp.materialType) {
            pricing[mp.materialType] = {
              defaultRate: mp.defaultRate,
              minCharge: mp.minCharge,
              freeTonnage: mp.freeTonnage,
              measure: mp.measure || formData.measure,
              overageThreshold: mp.overageThreshold,
              overageCharge: mp.overageCharge,
            }
          }
        })
      } else {
        // If no material-specific pricing, use the default for all selected materials
        const selectedMats = initialFee.materials || [initialFee.material]
        selectedMats.forEach((mat) => {
          if (mat) {
            pricing[mat] = {
              defaultRate: initialFee.defaultRate.replace("$", ""),
              minCharge: initialFee.minCharge.replace("$", ""),
              freeTonnage: initialFee.freeTonnage,
              measure: initialFee.measure,
              overageThreshold: initialFee.overageThreshold,
              overageCharge: initialFee.overageCharge,
            }
          }
        })
      }
      setMaterialPricing(pricing)

      // Set the measure value
      if (initialFee.measure) {
        handleChange("measure", initialFee.measure)
      }
    }
  }, [initialFee])

  // Validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : ""
      case "defaultRate":
        return isNaN(Number.parseFloat(value)) ? "Rate must be a number" : ""
      case "glCode":
        return value.trim() === "" ? "GL Code is required" : ""
      case "materials":
        return value.length === 0 ? "At least one material must be selected" : ""
      default:
        return ""
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    const error = validateField(field, formData[field as keyof DisposalFee])
    setErrors({ ...errors, [field]: error })
  }

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })

    if (touched[field]) {
      const error = validateField(field, value)
      setErrors({ ...errors, [field]: error })
    }
  }

  const handleMaterialChange = (material: string, checked: boolean) => {
    let newMaterials = [...selectedMaterials]

    if (checked) {
      newMaterials.push(material)

      // Initialize material pricing if not exists
      if (!materialPricing[material]) {
        setMaterialPricing({
          ...materialPricing,
          [material]: {
            defaultRate: formData.defaultRate.replace("$", ""),
            minCharge: formData.minCharge.replace("$", ""),
            freeTonnage: formData.freeTonnage,
            measure: formData.measure,
            overageThreshold: formData.overageThreshold,
            overageCharge: formData.overageCharge,
          },
        })
      }
    } else {
      newMaterials = newMaterials.filter((m) => m !== material)
    }

    setSelectedMaterials(newMaterials)
    handleChange("materials", newMaterials)
  }

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {}
    const allFields = ["name", "defaultRate", "glCode", "materials"]

    allFields.forEach((field) => {
      const error = validateField(field, formData[field as keyof DisposalFee])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))

    // If no errors, prepare and submit data
    if (Object.keys(newErrors).length === 0) {
      // Prepare final data
      const finalData = { ...formData }

      // Add material pricing if enabled
      if (useMaterialPricing && selectedMaterials.length > 1) {
        finalData.materialPricing = selectedMaterials.map((material) => ({
          materialType: material,
          defaultRate: `$${materialPricing[material].defaultRate}`,
          minCharge: `$${materialPricing[material].minCharge}`,
          freeTonnage: materialPricing[material].freeTonnage,
          measure: materialPricing[material].measure,
          overageThreshold: materialPricing[material].overageThreshold,
          overageCharge: materialPricing[material].overageCharge,
        }))
      }

      // Format currency values
      finalData.defaultRate = `$${finalData.defaultRate}`
      finalData.minCharge = `$${finalData.minCharge}`

      onSave(finalData)
    }
  }

  const applyDescriptionTemplate = (template: string) => {
    const materialText = selectedMaterials.length > 0 ? selectedMaterials.join(", ") : "selected materials"

    const businessText = formData.businessLine || "all"

    const description = template.replace("[material]", materialText).replace("[business]", businessText)

    handleChange("description", description)
    setShowDescriptionSuggestions(false)
  }

  const isFieldInvalid = (field: string) => {
    return touched[field] && errors[field]
  }

  return (
    <div className="space-y-6">
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{initialFee ? "Edit Disposal Fee" : "Create Disposal Fee"}</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for this disposal fee</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fee-name">Fee Name</Label>
                <Input
                  id="fee-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g., MSW Disposal Fee"
                  className={`h-10 ${isFieldInvalid("name") ? "border-red-500" : ""}`}
                />
                <div className="min-h-[20px]">
                  {isFieldInvalid("name") && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-gl-code">GL Code</Label>
                <Select
                  value={formData.glCode}
                  onValueChange={(value) => handleChange("glCode", value)}
                  onOpenChange={() => handleBlur("glCode")}
                >
                  <SelectTrigger
                    id="fee-gl-code"
                    className={`h-10 ${isFieldInvalid("glCode") ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select GL code" />
                  </SelectTrigger>
                  <SelectContent>
                    {glCodes.map((code) => (
                      <SelectItem key={code.id} value={code.code}>
                        {code.code} - {code.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-[20px]">
                  {isFieldInvalid("glCode") && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.glCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="fee-description">Description</Label>
                <Textarea
                  id="fee-description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter a description for this disposal fee"
                  rows={3}
                />
                {showDescriptionSuggestions && (
                  <div className="mt-2 border rounded-md p-2 bg-slate-50">
                    <p className="text-xs text-muted-foreground mb-2">Select a template:</p>
                    <div className="space-y-1">
                      {descriptionTemplates.map((template) => (
                        <Button
                          key={template.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left text-xs h-auto py-1"
                          onClick={() => applyDescriptionTemplate(template.text)}
                        >
                          {template.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Materials & Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Pricing</CardTitle>
            <CardDescription>Select materials and define the pricing structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Materials Selection Section */}
            <div className="space-y-4 border rounded-md p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">Materials</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="material-specific-pricing" className="text-sm">
                      Material-Specific Pricing
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">Material-specific pricing info</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-medium">Multiple materials selected</h4>
                          <p className="text-sm text-muted-foreground">
                            You can enable material-specific pricing to set different rates for each material.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Switch
                      id="material-specific-pricing"
                      checked={useMaterialPricing}
                      onCheckedChange={(checked) => {
                        if (checked && selectedMaterials.length <= 1) {
                          setErrors({
                            ...errors,
                            materialPricing: "Select multiple materials to enable material-specific pricing",
                          })
                          return
                        }
                        setErrors({
                          ...errors,
                          materialPricing: "",
                        })
                        setUseMaterialPricing(checked)
                      }}
                    />
                  </div>
                </div>

                {errors.materialPricing && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.materialPricing}
                  </p>
                )}

                <div className={isFieldInvalid("materials") ? "border border-red-500 rounded-md p-3" : ""}>
                  <div className="space-y-4">
                    <Select
                      onValueChange={(value) => {
                        if (!selectedMaterials.includes(value)) {
                          handleMaterialChange(value, true)
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a material type" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.name}
                            disabled={selectedMaterials.includes(material.name)}
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2">
                      {selectedMaterials.map((materialName) => {
                        const material = materials.find(m => m.name === materialName)
                        if (!material) return null
                        return (
                          <MaterialChip
                            key={material.id}
                            name={material.name}
                            color={material.color}
                            onRemove={() => handleMaterialChange(material.name, false)}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
                {isFieldInvalid("materials") && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.materials}
                  </p>
                )}
              </div>

              {!useMaterialPricing && (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee-default-rate">Default Rate</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="fee-default-rate"
                          value={formData.defaultRate}
                          onChange={(e) => handleChange("defaultRate", e.target.value)}
                          onBlur={() => handleBlur("defaultRate")}
                          className={`pl-7 h-10 ${isFieldInvalid("defaultRate") ? "border-red-500" : ""}`}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="min-h-[20px]">
                        {isFieldInvalid("defaultRate") && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.defaultRate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="measures">Measure</Label>
                      <Select 
                        value={formData.measure || "Per Ton"} 
                        onValueChange={(value) => handleChange("measure", value)}
                      >
                        <SelectTrigger id="measures" className="h-10">
                          <SelectValue placeholder="Select measure" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceMeasures.map((measure) => (
                            <SelectItem key={measure.id} value={measure.name}>
                              {measure.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-[20px]">
                        <p className="text-xs text-muted-foreground">How this fee is measured and charged</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee-overage-threshold">Overage Threshold</Label>
                      <div className="relative">
                        <Input
                          id="fee-overage-threshold"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.overageThreshold}
                          onChange={(e) => handleChange("overageThreshold", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="h-10"
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">
                          {formData.measure === "Per Ton" ? "tons" : 
                           formData.measure === "Per Cubic Yard" ? "yards" :
                           formData.measure === "Per Item" ? "items" :
                           formData.measure === "Per Container" ? "containers" :
                           formData.measure === "Per Day" ? "days" :
                           formData.measure === "Per Move" ? "moves" : "units"}
                        </span>
                      </div>
                      <div className="min-h-[20px]">
                        <p className="text-xs text-muted-foreground">
                          Amount before overage charges apply ({formData.measure.toLowerCase()})
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fee-overage-charge">Overage Charge</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="fee-overage-charge"
                          value={formData.overageCharge}
                          onChange={(e) => handleChange("overageCharge", e.target.value)}
                          className="pl-7 h-10"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="min-h-[20px]">
                        <p className="text-xs text-muted-foreground">
                          Additional charge per unit over threshold
                        </p>
                      </div>
                    </div>
                  </div>
                  {formData.measure === "Per Ton" && (
                    <div className="space-y-2">
                      <Label htmlFor="fee-free-tonnage">Free Tonnage</Label>
                      <div className="relative">
                        <Input
                          id="fee-free-tonnage"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.freeTonnage}
                          onChange={(e) => handleChange("freeTonnage", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="h-10"
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                      </div>
                      <div className="min-h-[20px]">
                        <p className="text-xs text-muted-foreground">Amount of material that is not charged</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {useMaterialPricing && selectedMaterials.length > 0 && (
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-medium">Material-Specific Pricing</h3>
                  <div className="space-y-4">
                    {selectedMaterials.map((material) => (
                      <div key={material} className="border rounded-md p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{material}</h4>
                          <MaterialChip
                            name={material}
                            color={materials.find(m => m.name === material)?.color || "bg-gray-200"}
                            onRemove={() => handleMaterialChange(material, false)}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor={`${material}-rate`}>Default Rate</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">$</span>
                              <Input
                                id={`${material}-rate`}
                                value={materialPricing[material]?.defaultRate || ""}
                                onChange={(e) => {
                                  setMaterialPricing({
                                    ...materialPricing,
                                    [material]: {
                                      ...materialPricing[material],
                                      defaultRate: e.target.value,
                                    },
                                  })
                                }}
                                className="pl-7 h-10"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${material}-measure`}>Measure</Label>
                            <Select
                              value={materialPricing[material]?.measure || formData.measure}
                              onValueChange={(value) => {
                                setMaterialPricing({
                                  ...materialPricing,
                                  [material]: {
                                    ...materialPricing[material],
                                    measure: value,
                                  },
                                })
                              }}
                            >
                              <SelectTrigger id={`${material}-measure`} className="h-10">
                                <SelectValue placeholder="Select measure" />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceMeasures.map((measure) => (
                                  <SelectItem key={measure.id} value={measure.name}>
                                    {measure.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {materialPricing[material]?.measure === "Per Ton" && (
                            <div className="space-y-2">
                              <Label htmlFor={`${material}-free-tonnage`}>Free Tonnage</Label>
                              <div className="relative">
                                <Input
                                  id={`${material}-free-tonnage`}
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={materialPricing[material]?.freeTonnage || 0}
                                  onChange={(e) => {
                                    setMaterialPricing({
                                      ...materialPricing,
                                      [material]: {
                                        ...materialPricing[material],
                                        freeTonnage: Number.parseFloat(e.target.value) || 0,
                                      },
                                    })
                                  }}
                                  placeholder="0.00"
                                  className="h-10"
                                />
                                <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                              </div>
                              <div className="min-h-[20px]">
                                <p className="text-xs text-muted-foreground">
                                  Amount of material that is not charged
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${material}-overage-threshold`}>Overage Threshold</Label>
                            <div className="relative">
                              <Input
                                id={`${material}-overage-threshold`}
                                type="number"
                                min="0"
                                step="0.1"
                                value={materialPricing[material]?.overageThreshold || 0}
                                onChange={(e) => {
                                  setMaterialPricing({
                                    ...materialPricing,
                                    [material]: {
                                      ...materialPricing[material],
                                      overageThreshold: Number.parseFloat(e.target.value) || 0,
                                    },
                                  })
                                }}
                                placeholder="0.00"
                                className="h-10"
                              />
                              <span className="absolute right-3 top-2.5 text-muted-foreground">
                                {materialPricing[material]?.measure === "Per Ton" ? "tons" : 
                                 materialPricing[material]?.measure === "Per Cubic Yard" ? "yards" :
                                 materialPricing[material]?.measure === "Per Item" ? "items" :
                                 materialPricing[material]?.measure === "Per Container" ? "containers" :
                                 materialPricing[material]?.measure === "Per Day" ? "days" :
                                 materialPricing[material]?.measure === "Per Move" ? "moves" : "units"}
                              </span>
                            </div>
                            <div className="min-h-[20px]">
                              <p className="text-xs text-muted-foreground">
                                Amount before overage charges apply ({materialPricing[material]?.measure.toLowerCase()})
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${material}-overage-charge`}>Overage Charge</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">$</span>
                              <Input
                                id={`${material}-overage-charge`}
                                value={materialPricing[material]?.overageCharge || ""}
                                onChange={(e) => {
                                  setMaterialPricing({
                                    ...materialPricing,
                                    [material]: {
                                      ...materialPricing[material],
                                      overageCharge: e.target.value,
                                    },
                                  })
                                }}
                                className="pl-7 h-10"
                                placeholder="0.00"
                              />
                            </div>
                            <div className="min-h-[20px]">
                              <p className="text-xs text-muted-foreground">
                                Additional charge per unit over threshold
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  )
}