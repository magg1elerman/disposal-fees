"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DisposalFeeForm } from "@/components/pricing/disposal-fee-form-v01b"
import { DisposalFeeFormV2 } from "@/components/pricing/disposal-fee-form-v02a"
import { DisposalFee } from "@/components/pricing/types"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus } from "lucide-react"

export default function DisposalFeesPage() {
  const [showForm, setShowForm] = useState(false)
  const [showFormV2, setShowFormV2] = useState(false)
  const [selectedFee, setSelectedFee] = useState<DisposalFee | undefined>()
  const { toast } = useToast()

  const handleSave = async (fee: DisposalFee) => {
    try {
      // TODO: Implement save logic
      toast({
        title: "Success",
        description: "Disposal fee saved successfully",
      })
      setShowForm(false)
      setShowFormV2(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save disposal fee",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Disposal Fees</h1>
        <div className="flex flex-col gap-2">
          <Button onClick={() => {
            setSelectedFee(undefined)
            setShowForm(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Disposal Fee
          </Button>
          <Button variant="outline" onClick={() => {
            setSelectedFee(undefined)
            setShowFormV2(true)
          }}>
            Create Disposal Fee (V2)
          </Button>
        </div>
      </div>

      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl">
            <DisposalFeeForm
              initialFee={selectedFee}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showFormV2 && (
        <Dialog open={showFormV2} onOpenChange={setShowFormV2}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
            <DisposalFeeFormV2
              initialFee={selectedFee}
              onSave={handleSave}
              onCancel={() => setShowFormV2(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  )
} 