// src/features/investment/context/SettingsContext.ts

"use client";

import { createContext } from "react";

import type { SettingsContextValue } from "./SettingsContext.types";

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export default SettingsContext;