"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle, HelpCircle, Copy } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MaterialChip } from "./material-chip"
import { cn } from "@/lib/utils"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { RadioGroup } from "@/components/ui/radio-group"
import { type DisposalFee, type MaterialPricing } from "./types"

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

interface Container {
  id: number
  name: string
  color: string
}

interface ContainerPricing {
  rate: string
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

export function DisposalFeeFormV3({ initialFee, onSave, onCancel }: DisposalFeeFormProps) {
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
      minChargedTonnage: 0,
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
    value: string | number | boolean,
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
    // Validate relevant fields
    const newErrors: Record<string, string> = {};
    const fieldsToValidate: string[] = ["name", "glCode"];
    if (formData.rateStructure === "Per Ton") {
      fieldsToValidate.push("materials");
    } else if (formData.rateStructure === "Per Container") {
      fieldsToValidate.push("containers");
    } else {
      fieldsToValidate.push("rate");
    }

    fieldsToValidate.forEach((field) => {
      const value = formData[field as keyof DisposalFee];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouched(fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    // If no errors, prepare and submit data
    if (Object.keys(newErrors).length === 0) {
      // Prepare final data
      const finalData = { ...formData }

      // Add material pricing if materials are selected
      if (selectedMaterials.length > 0) {
        finalData.materialPricing = selectedMaterials.map((material) => ({
          materialType: material,
          rate: materialPricing[material]?.rate || "",
          minCharge: materialPricing[material]?.minCharge || "",
          freeTonnage: materialPricing[material]?.freeTonnage || 0,
          rateStructure: materialPricing[material]?.rateStructure || formData.rateStructure,
          overageThreshold: materialPricing[material]?.overageThreshold || 0,
          overageCharge: materialPricing[material]?.overageCharge || "",
        }))
      }

      // Add container pricing if containers are selected
      if (selectedContainers.length > 0) {
        finalData.containers = selectedContainers
        finalData.containerPricing = selectedContainers.map((container) => ({
          containerType: container,
          rate: containerPricing[container]?.rate || "",
        }))
      }

      // Format currency values
      finalData.rate = `$${finalData.rate}`
      finalData.minCharge = `$${finalData.minCharge}`

      // Call onSave with the final data
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
    <div className="">
      <div className="p-6">
        <h2 className="text-xl font-bold">Disposal Fee v02b</h2>
        <div>
            {/* <ul className="list-disc list-inside px-2 text-sm">
                <li>Included Tonnage changed to Free Tonnage</li>
                <li>Min Charge column added instead of Chargeable colummn</li>
                <li>Overage Threshold and Overage Fee set globally</li>
            </ul> */}
        </div>
            
      </div>

      <div className="px-6">
        {/* Basic Information Section */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="col-span-1">
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

              <div className="col-span-1">
              <Label htmlFor="fee-name">Description</Label>
                <Input
                  id="fee-description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  placeholder="Enter a description for this disposal fee"
                  className="h-10"
                />
               
               
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
              <div className="col-span-2 flex items-end gap-4">
                <div className="flex-1">
                  <Label>Fee Structure</Label>
                  <RadioGroup
                    value={formData.rateStructure}
                    onValueChange={(value) => handleChange("rateStructure", value)}
                    className="flex gap-4 mt-2 h-10 items-center"
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
                </div>
                {formData.rateStructure === "Per Ton" && (
                  <>
                    <div className="flex-1">
                      <Label htmlFor="fee-overage-threshold">Overage Threshold</Label>
                      <div className="relative mt-2">
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
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="fee-overage-charge">Overage Fee</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-3 text-muted-foreground text-xs">$</span>
                        <Input
                          id="fee-overage-charge"
                          value={formData.overageCharge}
                          onChange={(e) => handleChange("overageCharge", e.target.value)}
                          className="pl-7 h-10"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Separator className="my-4" /> */}

        {/* Materials & Pricing Section */}
        <Card className="border-0 shadow-none">
       
          <CardContent className="space-y-6">
            {/* Materials Selection Section - Only show when rateStructure is not "Per Container" */}
            {formData.rateStructure !== "Per Container" && (
              <div className="">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Materials</Label>
                  </div>

                  <div className="space-y-4">
                    <div className={isFieldInvalid("materials") ? "border border-red-500 rounded-sm p-3" : ""}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px]">Material</TableHead>
                                <TableHead className="w-[220px]">Rate</TableHead>
                                <TableHead className="w-[220px]">Included Tonnage</TableHead>
                                <TableHead className="w-[220px]">Min. Charge</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedMaterials.map((materialName, index) => {
                                const material = materials.find(m => m.name === materialName)
                                if (!material) return null
                                return (
                                  <TableRow key={material.id}>
                                    <TableCell className="w-[200px]">
                                      <MaterialChip
                                        name={material.name}
                                        color={material.color}
                                        onRemove={() => handleMaterialToggle(material.name)}
                                      />
                                    </TableCell>
                                    <TableCell className="w-[220px]">
                                      <div className="relative flex items-center gap-2">
                                        <div className="relative w-[120px]">
                                          <span className="absolute left-3 top-3 text-muted-foreground text-xs">$</span>
                                          <Input
                                            id={`${material.name}-rate`}
                                            value={materialPricing[material.name]?.rate || ""}
                                            onChange={(e) => handleMaterialPricingChange(material.name, "rate", e.target.value)}
                                            className="pl-7 pr-10 h-10"
                                            placeholder="0.00"
                                          />
                                          <span className="absolute right-3 top-3 text-muted-foreground text-xs">/ ton</span>
                                        </div>
                                        {index === 0 && selectedMaterials.length > 1 && (
                                          <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="shrink-0 p-2"
                                                  onClick={() => {
                                                    if (selectedMaterials.length > 0) {
                                                      const firstMaterial = selectedMaterials[0]
                                                      const firstMaterialPrice = materialPricing[firstMaterial]?.rate || ""
                                                      const newPricing = { ...materialPricing }
                                                      selectedMaterials.forEach(material => {
                                                        newPricing[material] = {
                                                          ...newPricing[material],
                                                          rate: firstMaterialPrice
                                                        }
                                                      })
                                                      setMaterialPricing(newPricing)
                                                    }
                                                  }}
                                                >
                                                  <Copy className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Copy this value to all materials</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="w-[220px]">
                                      <div className="relative flex items-center gap-2">
                                        <div className="relative w-[120px]">
                                          <Input
                                            id={`${material.name}-included-tonnage`}
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={materialPricing[material.name]?.includedTonnage || ""}
                                            onChange={(e) => handleMaterialPricingChange(material.name, "includedTonnage", Number.parseFloat(e.target.value) || 0)}
                                            className="pr-10 h-10"
                                            placeholder="0.00"
                                          />
                                          <span className="absolute right-3 top-3 text-muted-foreground text-xs">tons</span>
                                        </div>
                                        {index === 0 && selectedMaterials.length > 1 && (
                                          <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="shrink-0 p-2"
                                                  onClick={() => {
                                                    if (selectedMaterials.length > 0) {
                                                      const firstMaterial = selectedMaterials[0]
                                                      const firstMaterialIncludedTonnage = materialPricing[firstMaterial]?.includedTonnage || 0
                                                      const newPricing = { ...materialPricing }
                                                      selectedMaterials.forEach(material => {
                                                        newPricing[material] = {
                                                          ...newPricing[material],
                                                          includedTonnage: firstMaterialIncludedTonnage
                                                        }
                                                      })
                                                      setMaterialPricing(newPricing)
                                                    }
                                                  }}
                                                >
                                                  <Copy className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Copy this value to all materials</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="w-[220px]">
                                      <div className="relative flex items-center gap-2">
                                        <div className="relative w-[120px]">
                                          <Input
                                            id={`${material.name}-min-charged-tonnage`}
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={materialPricing[material.name]?.minChargedTonnage || ""}
                                            onChange={(e) => handleMaterialPricingChange(material.name, "minChargedTonnage", Number.parseFloat(e.target.value) || 0)}
                                            className="pr-10 h-10"
                                            placeholder="0.00"
                                          />
                                          <span className="absolute right-3 top-3 text-muted-foreground text-xs">tons</span>
                                        </div>
                                        {index === 0 && selectedMaterials.length > 1 && (
                                          <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="shrink-0 p-2"
                                                  onClick={() => {
                                                    if (selectedMaterials.length > 0) {
                                                      const firstMaterial = selectedMaterials[0]
                                                      const firstMaterialMinChargedTonnage = materialPricing[firstMaterial]?.minChargedTonnage || 0
                                                      const newPricing = { ...materialPricing }
                                                      selectedMaterials.forEach(material => {
                                                        newPricing[material] = {
                                                          ...newPricing[material],
                                                          minChargedTonnage: firstMaterialMinChargedTonnage
                                                        }
                                                      })
                                                      setMaterialPricing(newPricing)
                                                    }
                                                  }}
                                                >
                                                  <Copy className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Copy this value to all materials</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Select
                                    onValueChange={(value) => {
                                      if (!selectedMaterials.includes(value)) {
                                        handleMaterialToggle(value)
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-1/2 border-0 p-0 h-auto hover:bg-transparent focus:ring-0 [&>svg]:hidden">
                                      <div className="flex items-center gap-1">
                                        <span>Add Material</span>
                                        <Plus className="h-4 w-4" />
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {materials
                                        .filter(material => !selectedMaterials.includes(material.name))
                                        .map((material) => (
                                          <SelectItem
                                            key={material.id}
                                            value={material.name}
                                          >
                                            {material.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    {isFieldInvalid("materials") && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.materials}
                      </p>
                    )}
                  </div>

                  {/* {formData.rateStructure === "Per Ton" && (
                    <>
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
                              Amount before overage fee applies
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fee-overage-charge">Overage Fee</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground text-xs">$</span>
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
                              Flat-rate fee charged when overage threshold is exceeded
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )} */}
                </div>
              </div>
            )}

            {/* Container Selection Section - Only show when rateStructure is "Per Container" */}
            {formData.rateStructure === "Per Container" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">Containers</Label>
                </div>

                <div className={isFieldInvalid("containers") ? "border border-red-500 rounded-sm p-3" : ""}>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Container Type</TableHead>
                          <TableHead className="w-[200px]">Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedContainers.map((containerName, index) => {
                          const container = containers.find(c => c.name === containerName)
                          if (!container) return null
                          return (
                            <TableRow key={container.id}>
                              <TableCell className="w-[180px]">
                                <MaterialChip
                                  name={container.name}
                                  color={container.color}
                                  onRemove={() => handleContainerToggle(container.name)}
                                />
                              </TableCell>
                              <TableCell className="w-[200px]">
                                <div className="relative flex items-center gap-2">
                                  <div className="relative w-[120px]">
                                    <span className="absolute left-3 top-3 text-muted-foreground text-xs">$</span>
                                    <Input
                                      id={`${container.name}-rate`}
                                      value={containerPricing[container.name]?.rate || ""}
                                      onChange={(e) => handleContainerPricingChange(container.name, "rate", e.target.value)}
                                      className="pl-7 pr-10 h-10"
                                      placeholder="0.00"
                                    />
                                    <span className="absolute right-3 top-3 text-muted-foreground text-xs">/ container</span>
                                  </div>
                                  {index === 0 && selectedContainers.length > 1 && (
                                    <TooltipProvider delayDuration={100}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="shrink-0 p-2"
                                            onClick={() => {
                                              if (selectedContainers.length > 0) {
                                                const firstContainer = selectedContainers[0]
                                                const firstContainerPrice = containerPricing[firstContainer]?.rate || ""
                                                const newPricing = { ...containerPricing }
                                                selectedContainers.forEach(container => {
                                                  newPricing[container] = {
                                                    ...newPricing[container],
                                                    rate: firstContainerPrice
                                                  }
                                                })
                                                setContainerPricing(newPricing)
                                              }
                                            }}
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Copy this value to all containers</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Select
                              onValueChange={(value) => {
                                if (!selectedContainers.includes(value)) {
                                  handleContainerToggle(value)
                                }
                              }}
                            >
                              <SelectTrigger className="w-1/2 border-0 p-0 h-auto hover:bg-transparent focus:ring-0 [&>svg]:hidden">
                                <div className="flex items-center gap-1">
                                  <span>Add Container</span>
                                  <Plus className="h-4 w-4" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {containers
                                  .filter(container => !selectedContainers.includes(container.name))
                                  .map((container) => (
                                    <SelectItem
                                      key={container.id}
                                      value={container.name}
                                    >
                                      {container.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {isFieldInvalid("containers") && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.containers}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 p-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  )
}
