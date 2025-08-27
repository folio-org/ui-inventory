import { InventoryProvider } from '../InventoryProvider';
import { SelectionProvider } from '../SelectionProvider';
import { ConfirmationBridgeProvider } from '../ConfirmationBridge';
import { DndStage } from '../DndStage';

export const DragAndDropProvider = ({
  children,
  leftInstance,
  rightInstance,
}) => {
  return (
    <InventoryProvider
      leftInstance={leftInstance}
      rightInstance={rightInstance}
    >
      <SelectionProvider>
        <ConfirmationBridgeProvider>
          <DndStage>
            {children}
          </DndStage>
        </ConfirmationBridgeProvider>
      </SelectionProvider>
    </InventoryProvider>
  );
};
