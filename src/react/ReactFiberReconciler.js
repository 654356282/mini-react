import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue";

export function updateContainer(element, container) {
  const current = container.current;

  const update = createUpdate();
  update.payload = { element };

  enqueueUpdate(current, update);
  const root = scheduleUpdateOnFiber(current);
}
