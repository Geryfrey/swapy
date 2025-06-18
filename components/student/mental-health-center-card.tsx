"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MentalHealthCenter } from "@/lib/types"
import { MapPin, Phone, Mail, Clock, Star, Navigation } from "lucide-react"

interface MentalHealthCenterCardProps {
  center: MentalHealthCenter
}

export function MentalHealthCenterCard({ center }: MentalHealthCenterCardProps) {
  const handleCall = () => {
    window.open(`tel:${center.phone}`)
  }

  const handleEmail = () => {
    window.open(`mailto:${center.email}`)
  }

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(center.address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{center.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{center.rating}</span>
              </div>
              {center.distance && (
                <Badge variant="outline" className="text-xs">
                  {center.distance} km away
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{center.address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{center.availability}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-1">
            {center.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCall} className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" onClick={handleEmail} className="flex-1">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={handleDirections} className="w-full">
            <Navigation className="h-4 w-4 mr-1" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
