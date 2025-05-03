
import React from "react";
export function Tabs({ children }) { return <div>{children}</div>; }
export function TabsList({ children }) { return <div className="flex space-x-2">{children}</div>; }
export function TabsTrigger({ children, value }) { return <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded" value={value}>{children}</button>; }
export function TabsContent({ children, value }) { return <div className="mt-4">{children}</div>; }
