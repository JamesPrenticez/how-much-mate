import { Canvas2D } from '../components/2D/canvas-2d';
import { Sidebar } from '../components/sidebar/sidebar';

export const Draw2DPage = () => {
  return (
    <div className="row">
      <Sidebar />
      <main>
        <Canvas2D />
      </main>
    </div>
  );
};
