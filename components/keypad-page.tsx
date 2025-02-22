"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, X } from "lucide-react";

interface KeypadPageProps {
  userId: string; // Add userId as a prop
}

const KeypadButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    className="w-20 h-20 text-2xl font-semibold rounded-full"
    onClick={onClick}
  >
    {children}
  </Button>
);

export default function KeypadPage({ userId }: KeypadPageProps) {
  const [number, setNumber] = React.useState("");
  const [calling, setCalling] = React.useState(false);

  // Replace this with the actual phone number you are using
  const myPhoneNumber = "+1 (903) 623-7510";

  const addDigit = (digit: string) => {
    setNumber((prev) => prev + digit);
  };

  const deleteDigit = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number.trim() === "") return;
    setCalling(true);
  };

  React.useEffect(() => {
    if (calling) {
      fetch("https://ai-call-center-o77f.onrender.com/outbound/make-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: number, userId }), // Include userId in the request body
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Call initiated:", data);
        })
        .catch((err) => console.error("Error making call:", err))
        .finally(() => setCalling(false));
    }
  }, [calling, number, userId]); // Add number and userId to the dependency array

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    // Allow digits, *, #, and +
    if (/[\d*#+]/.test(key)) {
      addDigit(key);
    }

    // Allow backspace to delete a digit
    if (key === "Backspace") {
      deleteDigit();
    }

    // Allow Enter to initiate a call
    if (key === "Enter") {
      handleCall();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Keypad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Display the phone number you are using */}
          <div className="text-center text-lg font-medium text-muted-foreground">
            Calling from: <span className="text-primary">{myPhoneNumber}</span>
          </div>

          <Input
            value={number}
            readOnly
            className="text-2xl text-center h-12"
            placeholder="Enter number"
            onKeyDown={handleKeyDown} // Add keyboard event listener
          />
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#", "+"].map((digit) => (
              <KeypadButton
                key={digit}
                onClick={() => addDigit(digit.toString())}
              >
                {digit}
              </KeypadButton>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-16 h-16"
              onClick={deleteDigit}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
              onClick={handleCall}
              disabled={calling}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
