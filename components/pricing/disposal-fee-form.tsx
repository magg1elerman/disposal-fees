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
import { RadioGroupItem } from "@/components/ui/radio-group"
import { RadioGroup } from "@/components/ui/radio-group"

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
  rateStructure: string
  rate: string
  minCharge: string
  freeTonnage: number
  overageCharge: string
  overageThreshold: number
  freeTonnageUnits?: string
}

interface Container {
  id: number
  name: string
  color: string
}

interface ContainerPricing {
  rate: string
}

interface DisposalFee {
  id?: number
  name: string
  description: string
  rateStructure: string
  rate: string
  minCharge: string
  overageCharge: string
  overageThreshold: number
  includedTonnage: number
  glCode: string
  businessLine: string
  materials?: string[]
  materialPricing?: MaterialPricing[]
  containers?: string[]
  containerPricing?: ContainerPricing[]
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

// Mock container data
const containers: Container[] = [
  { id: 1, name: "20 Yard", color: "bg-blue-200 text-black" },
  { id: 2, name: "30 Yard", color: "bg-green-200 text-black" },
  { id: 3, name: "40 Yard", color: "bg-cyan-100 text-black" },
  { id: 4, name: "10 Yard", color: "bg-purple-200 text-black" },
]

const businessLines = [
  { id: 1, name: "Residential", description: "Residential waste services" },
  { id: 2, name: "Commercial", description: "Commercial waste services" },
  { id: 3, name: "Roll-off", description: "Roll-off container services" },
  { id: 4, name: "All", description: "All business lines" },
]

export function DisposalFeeForm({ initialFee, onSave, onCancel }: DisposalFeeFormProps) {
  // Form state
  const [formData, setFormData] = useState<DisposalFee>(
    initialFee || {
      name: "",
      description: "",
      rateStructure: "Per Ton",
      rate: "",
      minCharge: "",
      overageCharge: "",
      overageThreshold: 0,
      includedTonnage: 0,
      glCode: "",
      businessLine: "",
      materials: [],
    },
  )

  // UI state
  const [useMaterialPricing, setUseMaterialPricing] = useState(false)
  const [useContainerPricing, setUseContainerPricing] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedContainers, setSelectedContainers] = useState<string[]>([])
  const [materialPricing, setMaterialPricing] = useState<Record<string, MaterialPricing>>({})
  const [containerPricing, setContainerPricing] = useState<Record<string, ContainerPricing>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false)

  // Initialize form data from initialFee
  useEffect(() => {
    if (initialFee) {
      // Set selected materials
      if (initialFee.materials && initialFee.materials.length > 0) {
        setSelectedMaterials(initialFee.materials)
      }

      // Set material-specific pricing
      const pricing: Record<string, any> = {}
      if (initialFee.materialPricing && initialFee.materialPricing.length > 0) {
        setUseMaterialPricing(true)
        initialFee.materialPricing.forEach((mp) => {
          if (mp.materialType) {
            pricing[mp.materialType] = {
              rate: mp.rate,
              minCharge: mp.minCharge,
              freeTonnage: mp.freeTonnage,
              rateStructure: mp.rateStructure || formData.rateStructure,
              overageThreshold: mp.overageThreshold,
              overageCharge: mp.overageCharge,
            }
          }
        })
      } else {
        // If no material-specific pricing, use the default for all selected materials
        const selectedMats = initialFee.materials || []
        selectedMats.forEach((mat) => {
          if (mat) {
            pricing[mat] = {
              rate: initialFee.rate.replace("$", ""),
              minCharge: initialFee.minCharge.replace("$", ""),
              includedTonnage: initialFee.includedTonnage,
              rateStructure: initialFee.rateStructure,
              overageThreshold: initialFee.overageThreshold,
              overageCharge: initialFee.overageCharge,
            }
          }
        })
      }
      setMaterialPricing(pricing)

      // Set the rateStructure value
      if (initialFee.rateStructure) {
        handleChange("rateStructure", initialFee.rateStructure)
      }

      // Set the businessLine value
      if (initialFee.businessLine) {
        handleChange("businessLine", initialFee.businessLine)
      }
    }
  }, [initialFee])

  // Validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : ""
      case "rate":
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

  const handleMaterialPricingChange = (
    material: string,
    field: string,
    value: string | number,
  ) => {
    setMaterialPricing((prev) => ({
      ...prev,
      [material]: {
        ...prev[material],
        [field]: value,
      },
    }))
  }

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(material)) {
        const newMaterials = prev.filter((m) => m !== material)
        setFormData((prevData) => ({
          ...prevData,
          materials: newMaterials,
        }))
        return newMaterials
      } else {
        const newMaterials = [...prev, material]
        setFormData((prevData) => ({
          ...prevData,
          materials: newMaterials,
        }))
        return newMaterials
      }
    })
  }

  const handleContainerToggle = (container: string) => {
    setSelectedContainers((prev) => {
      if (prev.includes(container)) {
        const newContainers = prev.filter((c) => c !== container)
        setFormData((prevData) => ({
          ...prevData,
          containers: newContainers,
        }))
        return newContainers
      } else {
        const newContainers = [...prev, container]
        setFormData((prevData) => ({
          ...prevData,
          containers: newContainers,
        }))
        return newContainers
      }
    })
  }

  const handleContainerPricingChange = (
    container: string,
    field: string,
    value: string | number,
  ) => {
    setContainerPricing((prev) => ({
      ...prev,
      [container]: {
        ...prev[container],
        [field]: value,
      },
    }))
  }

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {}
    const allFields = ["name", "rate", "glCode", "materials"]

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
          rate: `$${materialPricing[material].rate}`,
          minCharge: `$${materialPricing[material].minCharge}`,
          freeTonnage: materialPricing[material].freeTonnage,
          rateStructure: materialPricing[material].rateStructure,
          overageThreshold: materialPricing[material].overageThreshold,
          overageCharge: materialPricing[material].overageCharge,
        }))
      }

      // Format currency values
      finalData.rate = `$${finalData.rate}`
      finalData.minCharge = `$${finalData.minCharge}`

      onSave(finalData)
    }
  }

  const applyDescriptionTemplate = (template: string) => {
    const materialText = selectedMaterials.length > 0 ? selectedMaterials.join(", ") : "selected materials"
    const description = template.replace("[material]", materialText)
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
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for this disposal fee</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2 space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="fee-business-line">Business Line</Label>
                <Select
                  value={formData.businessLine}
                  onValueChange={(value) => handleChange("businessLine", value)}
                  onOpenChange={() => handleBlur("businessLine")}
                >
                  <SelectTrigger
                    id="fee-business-line"
                    className={`h-10 ${isFieldInvalid("businessLine") ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select business line" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessLines.map((line) => (
                      <SelectItem key={line.id} value={line.name}>
                        {line.name} - {line.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-[20px]">
                  {isFieldInvalid("businessLine") && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.businessLine}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee-gl-code">General Ledger</Label>
                <Select
                  value={formData.glCode}
                  onValueChange={(value) => handleChange("glCode", value)}
                  onOpenChange={() => handleBlur("glCode")}
                >
                  <SelectTrigger
                    id="fee-gl-code"
                    className={`h-10 ${isFieldInvalid("glCode") ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select General Ledger" />
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
                <Label>Fee Structure</Label>
                <RadioGroup
                  value={formData.rateStructure}
                  onValueChange={(value) => handleChange("rateStructure", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Per Ton" id="per-ton" />
                    <Label htmlFor="per-ton">Per Ton</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Per Container" id="per-container" />
                    <Label htmlFor="per-container">Per Container</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">How this fee is measured and charged</p>
              </div>

             
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Materials & Pricing Section */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Select materials and define the pricing structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Materials Selection Section */}
            <div className="space-y-4 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">Materials</Label>
                </div>

                <div className={isFieldInvalid("materials") ? "border border-red-500 rounded-md p-3" : ""}>
                  <div className="space-y-4">
                    <Select
                      onValueChange={(value) => {
                        if (!selectedMaterials.includes(value)) {
                          handleMaterialToggle(value)
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

                    <div className="space-y-2">
                      {selectedMaterials.map((materialName) => {
                        const material = materials.find(m => m.name === materialName)
                        if (!material) return null
                        return (
                          <div key={material.id} className="flex items-center">
                            <div className="w-[180px]">
                              <MaterialChip
                                name={material.name}
                                color={material.color}
                                onRemove={() => handleMaterialToggle(material.name)}
                              />
                            </div>
                            <div className="w-[200px]">
                              <div className="relative">
                                <span className="absolute left-3 top-2">$</span>
                                <Input
                                  id={`${material.name}-rate`}
                                  value={materialPricing[material.name]?.rate || ""}
                                  onChange={(e) => handleMaterialPricingChange(material.name, "rate", e.target.value)}
                                  className="pl-7 pr-10 h-10 w-[100px]"
                                  placeholder="0.00"
                                />
                                <span className="absolute left-[110px] top-2 text-muted-foreground">per ton</span>
                              </div>
                            </div>
                          </div>
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

              {formData.rateStructure === "Per Ton" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fee-included-tonnage">Included Tonnage</Label>
                    <div className="relative">
                      <Input
                        id="fee-included-tonnage"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.includedTonnage}
                        onChange={(e) => handleChange("includedTonnage", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="h-10"
                      />
                      <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                    </div>
                    <div className="min-h-[20px]">
                      <p className="text-xs text-muted-foreground">Amount of material that is included in the base rate</p>
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
                        <span className="absolute right-3 top-2.5 text-muted-foreground">tons</span>
                      </div>
                      <div className="min-h-[20px]">
                        <p className="text-xs text-muted-foreground">
                          Amount before overage charges apply
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
                          Additional charge per ton over threshold
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.rateStructure === "Per Container" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-1">Containers</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="container-specific-pricing" className="text-sm">
                          Container-Specific Pricing
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                              <HelpCircle className="h-4 w-4" />
                              <span className="sr-only">Container-specific pricing info</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="flex flex-col gap-2">
                              <h4 className="font-medium">Multiple containers selected</h4>
                              <p className="text-sm text-muted-foreground">
                                You can enable container-specific pricing to set different rates for each container type.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Switch
                          id="container-specific-pricing"
                          checked={useContainerPricing}
                          onCheckedChange={(checked) => {
                            if (checked && selectedContainers.length <= 1) {
                              setErrors({
                                ...errors,
                                containerPricing: "Select multiple containers to enable container-specific pricing",
                              })
                              return
                            }
                            setErrors({
                              ...errors,
                              containerPricing: "",
                            })
                            setUseContainerPricing(checked)
                          }}
                        />
                      </div>
                    </div>

                    {errors.containerPricing && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.containerPricing}
                      </p>
                    )}

                    <div className={isFieldInvalid("containers") ? "border border-red-500 rounded-md p-3" : ""}>
                      <div className="space-y-4">
                        <Select
                          onValueChange={(value) => {
                            if (!selectedContainers.includes(value)) {
                              handleContainerToggle(value)
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a container type" />
                          </SelectTrigger>
                          <SelectContent>
                            {containers.map((container) => (
                              <SelectItem
                                key={container.id}
                                value={container.name}
                                disabled={selectedContainers.includes(container.name)}
                              >
                                {container.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap gap-2">
                          {selectedContainers.map((containerName) => {
                            const container = containers.find(c => c.name === containerName)
                            if (!container) return null
                            return (
                              <MaterialChip
                                key={container.id}
                                name={container.name}
                                color={container.color}
                                onRemove={() => handleContainerToggle(container.name)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

              

                  {useContainerPricing && selectedContainers.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-sm font-medium">Container-Specific Rates</h3>
                      <div className="space-y-4">
                        {selectedContainers.map((container) => (
                          <div key={container} className="border rounded-md p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{container}</h4>
                              <MaterialChip
                                name={container}
                                color={containers.find(c => c.name === container)?.color || "bg-gray-200"}
                                onRemove={() => handleContainerToggle(container)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${container}-rate`}>Rate</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5">$</span>
                                <Input
                                  id={`${container}-rate`}
                                  value={containerPricing[container]?.rate || ""}
                                  onChange={(e) => handleContainerPricingChange(container, "rate", e.target.value)}
                                  className="pl-7 h-10"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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