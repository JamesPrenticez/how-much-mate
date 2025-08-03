import { useElementStore } from '@draw/stores';
import { Canvas2D } from '../components/2D/canvas-2d';
import { CadElement } from '@draw/models';

export const Draw2DPage = () => {
  const elements = useElementStore((s) => s.elements)

const cadElements: CadElement[] | null = elements?.[0]?.elementSubGroups?.[0]?.cadElements ?? null;

  return (
    cadElements ? (
      <Canvas2D cadElements={cadElements}/>
    ) : (
      <div>No data (loading...)</div>
    )
  );
};
