// draw/draw-geometry-resize-preview.tsx
import { DrawFunction, Shape } from '../models';
import { useCanvasStore } from '../stores/canvas.store';


// need to use this..
// and we need to update the quadtree with the new shape

export const drawResizePreview = (resizePreviewShape: Shape | null): DrawFunction => {
  return (canvas, canvasKit) => {
    if (!resizePreviewShape) return;

    const view = useCanvasStore.getState().view;

    // Create a semi-transparent paint for the preview
    const previewPaint = new canvasKit.Paint();
    previewPaint.setColor(canvasKit.parseColorString(resizePreviewShape.color));
    previewPaint.setAlphaf(0.5); // 50% transparency
    
    // Create a dashed stroke paint for the outline
    const outlinePaint = new canvasKit.Paint();
    outlinePaint.setStyle(canvasKit.PaintStyle.Stroke);
    outlinePaint.setStrokeWidth(1 / view.scale);
    outlinePaint.setColor(canvasKit.parseColorString('#666666'));
    outlinePaint.setAlphaf(0.7);
    
    // Create dash effect
    const dashEffect = canvasKit.PathEffect.MakeDash([4 / view.scale, 4 / view.scale], 0);
    outlinePaint.setPathEffect(dashEffect);

    // Antialiasing
    previewPaint.setAntiAlias(true);
    outlinePaint.setAntiAlias(true);

    switch (resizePreviewShape.type) {
      case 'rectangle':
        const rect = canvasKit.XYWHRect(
          resizePreviewShape.x,
          resizePreviewShape.y,
          resizePreviewShape.width,
          resizePreviewShape.height
        );
        
        // Draw filled preview
        canvas.drawRect(rect, previewPaint);
        // Draw dashed outline
        canvas.drawRect(rect, outlinePaint);
        break;

      case 'line':
        const linePath = new canvasKit.Path();
        linePath.moveTo(resizePreviewShape.x1, resizePreviewShape.y1);
        linePath.lineTo(resizePreviewShape.x2, resizePreviewShape.y2);
        
        // Set up line style for preview
        previewPaint.setStyle(canvasKit.PaintStyle.Stroke);
        previewPaint.setStrokeWidth((resizePreviewShape.strokeWidth || 2));
        previewPaint.setStrokeCap(canvasKit.StrokeCap.Round);
        previewPaint.setStrokeJoin(canvasKit.StrokeJoin.Round);
        
        canvas.drawPath(linePath, previewPaint);
        
        // Draw dashed outline (slightly thicker)
        outlinePaint.setStrokeWidth((resizePreviewShape.strokeWidth || 2) + 2 / view.scale);
        canvas.drawPath(linePath, outlinePaint);
        
        linePath.delete();
        break;

      case 'polyline':
        if (resizePreviewShape.points.length >= 2) {
          const polyPath = new canvasKit.Path();
          const firstPoint = resizePreviewShape.points[0];
          polyPath.moveTo(firstPoint.x, firstPoint.y);
          
          for (let i = 1; i < resizePreviewShape.points.length; i++) {
            polyPath.lineTo(resizePreviewShape.points[i].x, resizePreviewShape.points[i].y);
          }
          
          if (resizePreviewShape.closed) {
            polyPath.close();
          }
          
          // Set up polyline style for preview
          previewPaint.setStyle(canvasKit.PaintStyle.Stroke);
          previewPaint.setStrokeWidth(resizePreviewShape.strokeWidth || 2);
          previewPaint.setStrokeCap(canvasKit.StrokeCap.Round);
          previewPaint.setStrokeJoin(canvasKit.StrokeJoin.Round);
          
          canvas.drawPath(polyPath, previewPaint);
          
          // Draw dashed outline
          outlinePaint.setStrokeWidth((resizePreviewShape.strokeWidth || 2) + 2 / view.scale);
          canvas.drawPath(polyPath, outlinePaint);
          
          polyPath.delete();
        }
        break;

      case 'point':
        const radius = resizePreviewShape.radius || 3;
        
        // Draw filled preview circle
        canvas.drawCircle(resizePreviewShape.x, resizePreviewShape.y, radius, previewPaint);
        
        // Draw dashed outline circle
        outlinePaint.setStrokeWidth(1 / view.scale);
        canvas.drawCircle(resizePreviewShape.x, resizePreviewShape.y, radius + 2 / view.scale, outlinePaint);
        break;
    }

    // Cleanup
    previewPaint.delete();
    outlinePaint.delete();
    dashEffect.delete();
  };
};