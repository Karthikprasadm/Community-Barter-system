
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DownloadCloud, 
  Database, 
  FileJson, 
  FileText, 
  Table as TableIcon 
} from "lucide-react";
import { useBarterContext } from "@/context/BarterContext";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export const DataExport: React.FC = () => {
  const { users, items, offers, trades, ratings } = useBarterContext();
  const [selectedTables, setSelectedTables] = useState({
    users: true,
    items: true,
    offers: true,
    trades: true,
    ratings: true
  });
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  
  // Calculate the total number of records to be exported
  const totalCount = 
    (selectedTables.users ? users.length : 0) +
    (selectedTables.items ? items.length : 0) +
    (selectedTables.offers ? offers.length : 0) +
    (selectedTables.trades ? trades.length : 0) +
    (selectedTables.ratings ? ratings.length : 0);
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare export data
    const exportData: Record<string, unknown> = {};
    
    if (selectedTables.users) exportData.users = users;
    if (selectedTables.items) exportData.items = items;
    if (selectedTables.offers) exportData.offers = offers;
    if (selectedTables.trades) exportData.trades = trades;
    if (selectedTables.ratings) exportData.ratings = ratings;
    
    // Simulate processing delay
    setTimeout(() => {
      if (exportFormat === 'json') {
        // Export as JSON
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        const exportFileDefaultName = `barternexus-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else {
        // Export as CSV (simplified - in reality would need proper CSV formatting)
        let csvContent = '';
        
        // Process each table separately
        Object.entries(exportData).forEach(([tableName, data]) => {
          if (!Array.isArray(data) || data.length === 0) return;
          
          // Add table header
          csvContent += `\n--- ${tableName.toUpperCase()} ---\n`;
          
          // Add CSV headers
          const headers = Object.keys(data[0]);
          csvContent += headers.join(',') + '\n';
          
          // Add data rows
          data.forEach(row => {
            const rowValues = headers.map(header => {
              const value = row[header];
              // Handle different data types
              if (value === null || value === undefined) return '';
              if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
              return value;
            });
            csvContent += rowValues.join(',') + '\n';
          });
          
          csvContent += '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `barternexus-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
        URL.revokeObjectURL(url);
      }
      
      setIsExporting(false);
    }, 1000);
  };
  
  const handleTableToggle = (table: keyof typeof selectedTables) => {
    setSelectedTables(prev => ({
      ...prev,
      [table]: !prev[table]
    }));
  };
  
  const handleSelectAll = () => {
    const allSelected = Object.values(selectedTables).every(selected => selected);
    
    setSelectedTables({
      users: !allSelected,
      items: !allSelected,
      offers: !allSelected,
      trades: !allSelected,
      ratings: !allSelected
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Data Export
        </CardTitle>
        <CardDescription>
          Export database tables for backup or analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Select Tables</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
                className="h-8 text-xs"
              >
                {Object.values(selectedTables).every(s => s) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="users" 
                  checked={selectedTables.users} 
                  onCheckedChange={() => handleTableToggle('users')}
                />
                <Label htmlFor="users" className="text-sm flex items-center">
                  <span className="flex items-center">
                    <TableIcon className="h-3 w-3 mr-1 text-blue-500" />
                    Users
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({users.length} records)
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="items" 
                  checked={selectedTables.items}
                  onCheckedChange={() => handleTableToggle('items')}
                />
                <Label htmlFor="items" className="text-sm flex items-center">
                  <span className="flex items-center">
                    <TableIcon className="h-3 w-3 mr-1 text-green-500" />
                    Items
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({items.length} records)
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="offers" 
                  checked={selectedTables.offers}
                  onCheckedChange={() => handleTableToggle('offers')}
                />
                <Label htmlFor="offers" className="text-sm flex items-center">
                  <span className="flex items-center">
                    <TableIcon className="h-3 w-3 mr-1 text-purple-500" />
                    Offers
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({offers.length} records)
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="trades" 
                  checked={selectedTables.trades}
                  onCheckedChange={() => handleTableToggle('trades')}
                />
                <Label htmlFor="trades" className="text-sm flex items-center">
                  <span className="flex items-center">
                    <TableIcon className="h-3 w-3 mr-1 text-amber-500" />
                    Trades
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({trades.length} records)
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ratings" 
                  checked={selectedTables.ratings}
                  onCheckedChange={() => handleTableToggle('ratings')}
                />
                <Label htmlFor="ratings" className="text-sm flex items-center">
                  <span className="flex items-center">
                    <TableIcon className="h-3 w-3 mr-1 text-red-500" />
                    Ratings
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({ratings.length} records)
                  </span>
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Export Format</h3>
            <div className="flex gap-3">
              <div 
                className={`flex-1 cursor-pointer border rounded-md p-3 ${exportFormat === 'json' ? 'border-primary bg-primary/5' : 'border-muted'}`}
                onClick={() => setExportFormat('json')}
              >
                <div className="flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">JSON</h4>
                    <p className="text-xs text-muted-foreground">Complete structured data</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex-1 cursor-pointer border rounded-md p-3 ${exportFormat === 'csv' ? 'border-primary bg-primary/5' : 'border-muted'}`}
                onClick={() => setExportFormat('csv')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">CSV</h4>
                    <p className="text-xs text-muted-foreground">Spreadsheet compatible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-muted/50">
            <h3 className="text-sm font-medium mb-1">Export Summary</h3>
            <p className="text-xs text-muted-foreground">
              {totalCount} records from {Object.values(selectedTables).filter(Boolean).length} tables will be exported as {exportFormat.toUpperCase()}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || totalCount === 0}
          className="w-full flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <DownloadCloud className="h-4 w-4" />
              </motion.div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <DownloadCloud className="h-4 w-4" />
              <span>Export Data</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
