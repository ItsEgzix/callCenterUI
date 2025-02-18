"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

interface SettingsPanelProps {
  onSave: (settings: {
    inboundInstructions: string;
    outboundInstructions: string;
    inboundTemperature: number;
    outboundTemperature: number;
    inboundVoice: string;
    outboundVoice: string;
  }) => void;
  onClose: () => void;
}

export function SettingsPanel({ onSave, onClose }: SettingsPanelProps) {
  const [inboundInstructions, setInboundInstructions] = useState("");
  const [outboundInstructions, setOutboundInstructions] = useState("");
  const [inboundTemperature, setInboundTemperature] = useState(0.5);
  const [outboundTemperature, setOutboundTemperature] = useState(0.5);
  const [inboundVoice, setInboundVoice] = useState("voice-1");
  const [outboundVoice, setOutboundVoice] = useState("voice-1");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch system instructions from API
  const fetchSettings = async () => {
    try {
      const response = await fetch("https://ai-call-center-o77f.onrender.com/systemInstructionsRouter/system/instructions");
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);

      const data = await response.json();
      setInboundInstructions(data.inbound_instructions);
      setOutboundInstructions(data.outbound_instructions);
      setInboundTemperature(data.inbound_Temperature);
      setOutboundTemperature(data.outbound_Temperature);
      setInboundVoice(data.inbound_voice);
      setOutboundVoice(data.outbound_voice);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  // Save updated settings
  const handleSave = async () => {
    try {
      const response = await fetch("https://ai-call-center-o77f.onrender.com/systemInstructionsRouter/system/instructions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inbound_instructions: inboundInstructions,
          outbound_instructions: outboundInstructions,
          inbound_Temperature: inboundTemperature,
          outbound_Temperature: outboundTemperature,
          inbound_voice: inboundVoice,
          outbound_voice: outboundVoice,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);

      onSave({
        inboundInstructions,
        outboundInstructions,
        inboundTemperature,
        outboundTemperature,
        inboundVoice,
        outboundVoice,
      });

      setIsEdited(false);
      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Warn user if they try to leave without saving
  const handleClose = () => {
    if (isEdited && !window.confirm("You have unsaved changes. Do you want to leave?")) {
      return;
    }
    onClose();
  };

  return (
    <div className="space-y-4">
      <CardDescription className="text-center">
        Configure system instructions, temperature, and voice settings for inbound and outbound calls.
      </CardDescription>

      {/* Inbound Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inbound Settings</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Instructions</label>
          <textarea
            value={inboundInstructions}
            onChange={(e) => {
              setInboundInstructions(e.target.value);
              setIsEdited(true);
            }}
            placeholder="Enter instructions for inbound calls..."
            rows={4}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Temperature</label>
          <CardDescription className="text-start">
            High temperature generates more varied and creative text,
            potentially including unexpected or even nonsensical phrases.
          </CardDescription>
          <span className="text-lg font-medium">{inboundTemperature.toFixed(1)}</span>
          <Slider
            value={[inboundTemperature]}
            onValueChange={(value) => {
              setInboundTemperature(value[0]);
              setIsEdited(true);
            }}
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Voice</label>
          <select
            value={inboundVoice}
            onChange={(e) => {
              setInboundVoice(e.target.value);
              setIsEdited(true);
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="alloy">Alloy</option>
            <option value="ash">Ash</option>
            <option value="coral">Coral</option>
          </select>
        </div>
      </div>

      {/* Outbound Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Outbound Settings</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Instructions</label>
          <textarea
            value={outboundInstructions}
            onChange={(e) => {
              setOutboundInstructions(e.target.value);
              setIsEdited(true);
            }}
            placeholder="Enter instructions for outbound calls..."
            rows={4}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Temperature</label>
          <CardDescription className="text-start">
            Low temperature produces more predictable and consistent text, often
            preferred for tasks requiring accuracy.
          </CardDescription>
          <span className="text-lg font-medium">{outboundTemperature.toFixed(1)}</span>
          <Slider
            value={[outboundTemperature]}
            onValueChange={(value) => {
              setOutboundTemperature(value[0]);
              setIsEdited(true);
            }}
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Voice</label>
          <select
            value={outboundVoice}
            onChange={(e) => {
              setOutboundVoice(e.target.value);
              setIsEdited(true);
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="voice-1">Alloy</option>
            <option value="voice-2">Ash</option>
            <option value="voice-3">Coral</option>
          </select>
        </div>
      </div>

      {/* Save and Close Buttons */}
      <div className="flex space-x-4">
        <Button className="flex-1" onClick={handleSave}>
          Save
        </Button>
        <Button className="flex-1" variant="outline" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
