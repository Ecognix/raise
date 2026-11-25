import React, { createContext, useContext, useState } from 'react';
import {
  RoadSegment,
  Defect,
  DrainCulvert,
  MaintenanceKanbanCard,
  LifelineWeights
} from '../types';
import {
  initialRoadsData,
  initialDefectsData,
  initialDrainsData,
  initialKanbanCards,
  defaultLifelineWeights
} from '../data';

interface DataContextType {
  roads: RoadSegment[];
  defects: Defect[];
  drains: DrainCulvert[];
  kanbanCards: MaintenanceKanbanCard[];
  lifelineWeights: LifelineWeights;
  selectedRoadId: string | null;
  setSelectedRoadId: (id: string | null) => void;
  verifyDefect: (defectId: string, engineerName?: string) => void;
  updateDefectStatus: (defectId: string, status: Defect['status']) => void;
  moveKanbanCard: (cardId: string, newStatus: MaintenanceKanbanCard['status']) => void;
  setLifelineWeights: React.Dispatch<React.SetStateAction<LifelineWeights>>;
  resetToDefaultWeights: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roads] = useState<RoadSegment[]>(initialRoadsData);
  const [defects, setDefects] = useState<Defect[]>(initialDefectsData);
  const [drains] = useState<DrainCulvert[]>(initialDrainsData);
  const [kanbanCards, setKanbanCards] = useState<MaintenanceKanbanCard[]>(initialKanbanCards);
  const [lifelineWeights, setLifelineWeights] = useState<LifelineWeights>(defaultLifelineWeights);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>("RD-GAU-001");

  const verifyDefect = (defectId: string, engineerName = "Er. A. K. Choudhury (Executive Engineer)") => {
    setDefects(prev =>
      prev.map(d => {
        if (d.id === defectId) {
          return {
            ...d,
            source: 'Field-verified',
            status: d.status === 'AI-detected' ? 'Field-verified' : d.status,
            verifiedBy: engineerName,
            verificationDate: new Date().toISOString().split('T')[0],
          };
        }
        return d;
      })
    );

    // Also update matching kanban card if exists
    setKanbanCards(prev =>
      prev.map(card => {
        if (card.defectId === defectId && card.status === 'Detected') {
          return {
            ...card,
            status: 'Verified',
            contractorNotes: `${card.contractorNotes || ''} Verified on-site by ${engineerName}.`,
          };
        }
        return card;
      })
    );
  };

  const updateDefectStatus = (defectId: string, status: Defect['status']) => {
    setDefects(prev =>
      prev.map(d => (d.id === defectId ? { ...d, status } : d))
    );
  };

  const moveKanbanCard = (cardId: string, newStatus: MaintenanceKanbanCard['status']) => {
    setKanbanCards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          const updated = { ...card, status: newStatus };
          if (newStatus === 'Repaired' && !card.repairDate) {
            updated.repairDate = new Date().toISOString().split('T')[0];
            updated.afterPhoto = 'Resurfaced bitumen section compacted and sealed';
          }
          return updated;
        }
        return card;
      })
    );
  };

  const resetToDefaultWeights = () => {
    setLifelineWeights(defaultLifelineWeights);
  };

  return (
    <DataContext.Provider
      value={{
        roads,
        defects,
        drains,
        kanbanCards,
        lifelineWeights,
        selectedRoadId,
        setSelectedRoadId,
        verifyDefect,
        updateDefectStatus,
        moveKanbanCard,
        setLifelineWeights,
        resetToDefaultWeights,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
