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
  freeTonnageUnits?: string
  tiers: { id: number; from: number; to: number | null; rate: number }[]
}

interface DisposalFee {
  id?: number
  name: string
  description: string
  measure: string
  defaultRate: string
  minCharge: string
  businessLine: string
  status: string
  locations?: number
  material?: string
  materials?: string[]
  freeTonnage: number
  glCode: string
  linkedServices?: number
  tiers: { id: number; from: number; to: number | null; rate: number }[]
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
      businessLine: "All",
      status: "Active",
      freeTonnage: 0,
      glCode: "",
      tiers: [{ id: 1, from: 0, to: null, rate: 0 }],
      materials: [],
    },
  )

  // UI state
  const [activeTab, setActiveTab] = useState("basic")
  const [useTieredPricing, setUseTieredPricing] = useState(false)
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
        tiers: { id: number; from: number; to: number | null; rate: number }[]
      }
    >
  >({})
  const [errors, setErrors] = useState<Record<string, string>>({
    materialPricing: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false)
  const [autolinkEnabled, setAutolinkEnabled] = useState(true)

  // Initialize form data from initialFee
  useEffect(() => {
    if (initialFee) {
      setUseTieredPricing(initialFee.tiers?.length > 1)

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
              tiers: mp.tiers,
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
              tiers: [...initialFee.tiers],
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
            tiers: [...formData.tiers],
          },
        })
      }
    } else {
      newMaterials = newMaterials.filter((m) => m !== material)
    }

    setSelectedMaterials(newMaterials)
    handleChange("materials", newMaterials)
  }

  const handleTierChange = (index: number, field: string, value: any) => {
    const newTiers = [...formData.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    handleChange("tiers", newTiers)
  }

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1]
    const newTier = {
      id: Math.max(...formData.tiers.map((t) => t.id)) + 1,
      from: lastTier.to || 0,
      to: null,
      rate: lastTier.rate * 0.9,
    }
    handleChange("tiers", [...formData.tiers, newTier])
  }

  const removeTier = (id: number) => {
    handleChange(
      "tiers",
      formData.tiers.filter((t) => t.id !== id),
    )
  }

  const handleMaterialPricingChange = (material: string, field: string, value: any) => {
    setMaterialPricing({
      ...materialPricing,
      [material]: {
        ...materialPricing[material],
        [field]: value,
      },
    })
  }

  const handleMaterialTierChange = (material: string, index: number, field: string, value: any) => {
    const newTiers = [...materialPricing[material].tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }

    setMaterialPricing({
      ...materialPricing,
      [material]: {
        ...materialPricing[material],
        tiers: newTiers,
      },
    })
  }

  const addMaterialTier = (material: string) => {
    const materialData = materialPricing[material]
    const lastTier = materialData.tiers[materialData.tiers.length - 1]

    const newTier = {
      id: Math.max(...materialData.tiers.map((t) => t.id)) + 1,
      from: lastTier.to || 0,
      to: null,
      rate: lastTier.rate * 0.9,
    }

    setMaterialPricing({
      ...materialPricing,
      [material]: {
        ...materialData,
        tiers: [...materialData.tiers, newTier],
      },
    })
  }

  const removeMaterialTier = (material: string, id: number) => {
    setMaterialPricing({
      ...materialPricing,
      [material]: {
        ...materialPricing[material],
        tiers: materialPricing[material].tiers.filter((t) => t.id !== id),
      },
    })
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
          tiers: materialPricing[material].tiers,
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Materials</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 p-6">
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
                  <Label htmlFor="fee-business-line">Business Line</Label>
                  <Select value={formData.businessLine} onValueChange={(value) => handleChange("businessLine", value)}>
                    <SelectTrigger id="fee-business-line" className="h-10">
                      <SelectValue placeholder="Select business line" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Roll-off">Roll-off</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[20px]"></div>
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

                <div className="space-y-2">
                  <Label htmlFor="fee-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger id="fee-status" className="h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[20px]"></div>
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

              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium">Pricing Zones</h3>
                <div className="border rounded-md p-4 bg-slate-50">
                  <div className="space-y-3">
                    {[
                      { id: 1, name: "Zone A", description: "Metropolitan Area" },
                      { id: 2, name: "Zone B", description: "Suburban Area" },
                      { id: 3, name: "Zone C", description: "Rural Area" },
                    ].map((zone) => (
                      <div key={zone.id} className="flex items-center space-x-2 py-2 border-b border-slate-200">
                        <Checkbox id={`zone-${zone.id}`} />
                        <div>
                          <Label htmlFor={`zone-${zone.id}`}>{zone.name}</Label>
                          <p className="text-xs text-muted-foreground">{zone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => setActiveTab("pricing")}>Next: Pricing & Materials</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pricing & Materials Tab */}
        <TabsContent value="pricing" className="space-y-4 pt-4">
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
                            // Show error if trying to enable with only one material
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

                {/* Material-specific pricing section */}
                {useMaterialPricing && selectedMaterials.length > 1 && (
                  <div className="space-y-4 border-t pt-4 mt-4">
                    <div className="border rounded-md p-4 bg-slate-50">
                      <Tabs defaultValue={selectedMaterials[0]} className="w-full">
                        <TabsList className="flex flex-wrap gap-2">
                          {selectedMaterials.map((materialName) => {
                            const material = materials.find(m => m.name === materialName)
                            if (!material) return null
                            return (
                              <TabsTrigger
                                key={materialName}
                                value={materialName}
                                className={cn(
                                  "data-[state=active]:shadow-sm",
                                  "data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 data-[state=inactive]:border-gray-200",
                                  "data-[state=active]:bg-white",
                                  material.color
                                )}
                              >
                                {materialName}
                              </TabsTrigger>
                            )
                          })}
                        </TabsList>

                        {selectedMaterials.map((materialName) => {
                          const material = materials.find(m => m.name === materialName)
                          if (!material) return null
                          return (
                            <TabsContent key={materialName} value={materialName} className="space-y-4 pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2 order-first">
                                  <Label htmlFor={`${materialName}-default-rate`}>Default Rate</Label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5">$</span>
                                    <Input
                                      id={`${materialName}-default-rate`}
                                      value={materialPricing[materialName]?.defaultRate || ""}
                                      onChange={(e) =>
                                        handleMaterialPricingChange(materialName, "defaultRate", e.target.value)
                                      }
                                      className="pl-7 h-10"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`${materialName}-measure`}>Measure</Label>
                                  <Select
                                    value={materialPricing[materialName]?.measure || formData.measure}
                                    onValueChange={(value) => handleMaterialPricingChange(materialName, "measure", value)}
                                  >
                                    <SelectTrigger id={`${materialName}-measure`} className="h-10">
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

                                <div className="space-y-2">
                                  <Label htmlFor={`${materialName}-free-tonnage`}>Free Tonnage</Label>
                                  <div className="relative">
                                    <Input
                                      id={`${materialName}-free-tonnage`}
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      value={materialPricing[materialName]?.freeTonnage || 0}
                                      onChange={(e) =>
                                        handleMaterialPricingChange(
                                          materialName,
                                          "freeTonnage",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0.00"
                                      className="h-10"
                                    />
                                    <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`${materialName}-use-tiers`}>Use Tiered Pricing</Label>
                                  <Switch
                                    id={`${materialName}-use-tiers`}
                                    checked={materialPricing[materialName]?.tiers?.length > 1}
                                    onCheckedChange={(checked) => {
                                      if (
                                        checked &&
                                        (!materialPricing[materialName]?.tiers ||
                                          materialPricing[materialName]?.tiers.length <= 1)
                                      ) {
                                        // Add a second tier if enabling tiered pricing
                                        handleMaterialPricingChange(materialName, "tiers", [
                                          {
                                            id: 1,
                                            from: 0,
                                            to: 2,
                                            rate: Number.parseFloat(materialPricing[materialName]?.defaultRate || "0"),
                                          },
                                          {
                                            id: 2,
                                            from: 2,
                                            to: null,
                                            rate: Number.parseFloat(materialPricing[materialName]?.defaultRate || "0") * 0.9,
                                          },
                                        ])
                                      } else if (!checked && materialPricing[materialName]?.tiers?.length > 1) {
                                        // Remove all but first tier if disabling
                                        handleMaterialPricingChange(materialName, "tiers", [
                                          materialPricing[materialName]?.tiers[0] || {
                                            id: 1,
                                            from: 0,
                                            to: null,
                                            rate: Number.parseFloat(materialPricing[materialName]?.defaultRate || "0"),
                                          },
                                        ])
                                      }
                                    }}
                                  />
                                </div>

                                {materialPricing[materialName]?.tiers?.length > 1 && (
                                  <div className="border rounded-md p-4 mt-2">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-sm font-medium">{materialName} Pricing Tiers</h4>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addMaterialTier(materialName)}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Tier
                                      </Button>
                                    </div>

                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>From (tons)</TableHead>
                                          <TableHead>To (tons)</TableHead>
                                          <TableHead>Rate</TableHead>
                                          <TableHead className="w-[100px]">Actions</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {materialPricing[materialName]?.tiers?.map((tier, index) => (
                                          <TableRow key={tier.id}>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={tier.from}
                                                onChange={(e) =>
                                                  handleMaterialTierChange(
                                                    materialName,
                                                    index,
                                                    "from",
                                                    Number.parseFloat(e.target.value) || 0,
                                                  )
                                                }
                                                className="w-20 h-10"
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={tier.to === null ? "" : tier.to}
                                                onChange={(e) => {
                                                  const value =
                                                    e.target.value.trim() === ""
                                                      ? null
                                                      : Number.parseFloat(e.target.value) || 0
                                                  handleMaterialTierChange(materialName, index, "to", value)
                                                }}
                                                className="w-20 h-10"
                                                placeholder="∞"
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <div className="relative">
                                                <span className="absolute left-3 top-2.5">$</span>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  step="0.01"
                                                  value={tier.rate}
                                                  onChange={(e) =>
                                                    handleMaterialTierChange(
                                                      materialName,
                                                      index,
                                                      "rate",
                                                      Number.parseFloat(e.target.value) || 0,
                                                    )
                                                  }
                                                  className="w-24 pl-7 h-10"
                                                />
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => removeMaterialTier(materialName, tier.id)}
                                                disabled={materialPricing[materialName]?.tiers?.length <= 1}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          )
                        })}
                      </Tabs>
                    </div>
                  </div>
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
                  <div className="space-y-2 mt-4">
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

                  <Separator />

                  {/* Tiered pricing section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Tiered Pricing</h3>
                        <p className="text-xs text-muted-foreground">
                          Enable tiered pricing to charge different rates based on quantity
                        </p>
                      </div>
                      <Switch
                        checked={useTieredPricing}
                        onCheckedChange={(checked) => {
                          setUseTieredPricing(checked)
                          if (!checked) {
                            // Reset to single tier
                            handleChange("tiers", [
                              { id: 1, from: 0, to: null, rate: Number.parseFloat(formData.defaultRate) || 0 },
                            ])
                          } else if (formData.tiers.length <= 1) {
                            // Add a second tier
                            handleChange("tiers", [
                              { id: 1, from: 0, to: 2, rate: Number.parseFloat(formData.defaultRate) || 0 },
                              { id: 2, from: 2, to: null, rate: (Number.parseFloat(formData.defaultRate) || 0) * 0.9 },
                            ])
                          }
                        }}
                      />
                    </div>

                    {useTieredPricing && (
                      <div className="border rounded-md p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium">Pricing Tiers</h4>
                          <Button type="button" size="sm" variant="outline" onClick={addTier}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tier
                          </Button>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>From ({formData.measure.includes("Ton") ? "tons" : "units"})</TableHead>
                              <TableHead>To ({formData.measure.includes("Ton") ? "tons" : "units"})</TableHead>
                              <TableHead>Rate</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {formData.tiers.map((tier, index) => (
                              <TableRow key={tier.id}>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={tier.from}
                                    onChange={(e) =>
                                      handleTierChange(index, "from", Number.parseFloat(e.target.value) || 0)
                                    }
                                    className="w-20 h-10"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={tier.to === null ? "" : tier.to}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value.trim() === "" ? null : Number.parseFloat(e.target.value) || 0
                                      handleTierChange(index, "to", value)
                                    }}
                                    className="w-20 h-10"
                                    placeholder="∞"
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5">$</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={tier.rate}
                                      onChange={(e) =>
                                        handleTierChange(index, "rate", Number.parseFloat(e.target.value) || 0)
                                      }
                                      className="w-24 pl-7 h-10"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => removeTier(tier.id)}
                                    disabled={formData.tiers.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>Tiered pricing allows you to set different rates based on quantity ranges.</p>
                          <p>For example: $65/ton for 0-2 tons, $55/ton for 2-5 tons, and $45/ton for over 5 tons.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Previous: Basic Info
              </Button>
              <Button onClick={() => setActiveTab("advanced")}>Next: Advanced</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure additional settings for this disposal fee</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Autolinking</h3>
                <div className="space-y-4 border rounded-md p-4 bg-slate-50">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium">Enable Autolinking</h4>
                      <p className="text-xs text-muted-foreground mt-1">Automatically link services to this fee</p>
                    </div>
                    <Switch checked={autolinkEnabled} onCheckedChange={setAutolinkEnabled} />
                  </div>

                  <div className={`space-y-3 ${!autolinkEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <h4 className="text-sm font-medium">Match by Material Type</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only link services with matching material type
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <h4 className="text-sm font-medium">Match by Location</h4>
                        <p className="text-xs text-muted-foreground mt-1">Only link services in the same location</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">How Autolinking Works:</span> Services with matching business line
                      and material type will be automatically linked to this fee.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Associated Fees & Taxes</h3>
                <div className="border rounded-md p-4 bg-slate-50">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No associated fees or taxes</p>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee or Tax
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}