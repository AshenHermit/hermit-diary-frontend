"use client";

import { PropertyValueType } from "@/services/types/properties";
import React from "react";

export type PropertyType = {
  key: string;
  icon: React.ReactElement;
};

export type OptionSchema = {
  types: Record<string, PropertyType>;
  title: string;
  description: string;
};

export type PropertiesEditorProps = {
  options: Record<string, OptionSchema>;
  value: Record<string, PropertyValueType>;
  onValueChange: (key: string, value: PropertyValueType) => void;
};

function PropertiesEditor({}: PropertiesEditorProps) {
  return <div></div>;
}
