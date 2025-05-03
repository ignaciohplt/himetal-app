
import React from "react";
export function Select({ children, ...props }) { return <div {...props} className="w-full">{children}</div>; }
export function SelectContent({ children }) { return <select className="border rounded px-2 py-1 w-full">{children}</select>; }
export function SelectItem({ children, value }) { return <option value={value}>{children}</option>; }
export function SelectTrigger({ children }) { return <span>{children}</span>; }
