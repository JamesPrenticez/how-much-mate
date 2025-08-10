
import { EntryPoint } from '../components/advanced/entry-point';

export const Draw2DPage = () => {
  return <EntryPoint />
  // const elements = useElementStore((s) => s.elements)

  // const cadElements: CadElement[] | null = elements?.[0]?.elementSubGroups?.[0]?.cadElements ?? null;

  // return (
  //   cadElements ? (
  //     <Canvas2D cadElements={cadElements}/>
  //   ) : (
  //     <div>No data (loading...)</div>
  //   )
  // );
};
