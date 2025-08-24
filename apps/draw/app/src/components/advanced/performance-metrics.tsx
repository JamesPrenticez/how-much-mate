// components/PerformanceDashboard.tsx
import styled from '@emotion/styled';
import { useShapesStore } from './stores';

const DashboardContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  min-width: 220px;
  backdrop-filter: blur(4px);
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
    font-size: 10px;
    padding: 8px;
    min-width: 180px;
  }
`;

const MetricRow = styled.div<{ warning?: boolean; good?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: ${props => 
    props.warning ? '#ff6b6b' : 
    props.good ? '#4ecdc4' : 
    '#ffffff'
  };
`;

const MetricLabel = styled.span`
  font-weight: normal;
`;

const MetricValue = styled.span`
  font-weight: bold;
  text-align: right;
`;

const StatusIndicator = styled.div<{ active?: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  background: ${props => props.active ? '#4ecdc4' : '#666'};
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #444;
  margin: 8px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin: 4px 0;
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  width: ${props => Math.min(100, Math.max(0, props.percentage))}%;
  height: 100%;
  background: ${props => props.color || '#4ecdc4'};
  transition: width 0.2s ease;
`;

export const PerformanceDashboard = () => {
  const metrics = useShapesStore(s => s.performanceMetrics);
  
  // Calculate performance thresholds
  const fpsGood = metrics.fps >= 50;
  const fpsWarning = metrics.fps < 30;
  const renderTimeGood = metrics.avgRenderTime < 5;
  const renderTimeWarning = metrics.avgRenderTime > 10;
  const cacheEfficient = metrics.cacheHitRate > 70;
  
  // Calculate efficiency percentages
  const fpsPercentage = Math.min((metrics.fps / 60) * 100, 100);
  const cachePercentage = metrics.cacheHitRate;
  const cullingEfficiency = metrics.totalShapes > 0 
    ? ((metrics.totalShapes - metrics.visibleShapes) / metrics.totalShapes) * 100 
    : 0;
  
  return (
    <DashboardContainer>
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>
        🚀 Performance Monitor
      </div>
      
      <MetricRow good={fpsGood} warning={fpsWarning}>
        <MetricLabel>FPS:</MetricLabel>
        <MetricValue>{metrics.fps}</MetricValue>
      </MetricRow>
      <ProgressBar>
        <ProgressFill 
          percentage={fpsPercentage} 
          color={fpsWarning ? '#ff6b6b' : fpsGood ? '#4ecdc4' : '#ffd93d'}
        />
      </ProgressBar>
      
      <MetricRow good={renderTimeGood} warning={renderTimeWarning}>
        <MetricLabel>Render Time:</MetricLabel>
        <MetricValue>{metrics.avgRenderTime.toFixed(1)}ms</MetricValue>
      </MetricRow>
      
      <MetricRow good={cacheEfficient} warning={!cacheEfficient}>
        <MetricLabel>Cache Hit Rate:</MetricLabel>
        <MetricLabel>
        Percentage of frames using cached background
        </MetricLabel>
        <MetricValue>{metrics.cacheHitRate.toFixed(1)}%</MetricValue>
      </MetricRow>
      <ProgressBar>
        <ProgressFill 
          percentage={cachePercentage} 
          color={cachePercentage > 70 ? '#4ecdc4' : cachePercentage > 40 ? '#ffd93d' : '#ff6b6b'}
        />
      </ProgressBar>
      
      <SectionDivider />
      
      <MetricRow>
        <MetricLabel>Visible Shapes:</MetricLabel>
        <MetricValue>{metrics.visibleShapes}</MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel>Total Shapes:</MetricLabel>
        <MetricValue>{metrics.totalShapes}</MetricValue>
      </MetricRow>
      
      <MetricRow good={cullingEfficiency > 50}>
        <MetricLabel>Culling Efficiency:</MetricLabel>
        <MetricValue>{cullingEfficiency.toFixed(1)}%</MetricValue>
      </MetricRow>
      <ProgressBar>
        <ProgressFill 
          percentage={cullingEfficiency} 
          color={cullingEfficiency > 50 ? '#4ecdc4' : '#ffd93d'}
        />
      </ProgressBar>
      
      <SectionDivider />
      
      <MetricRow>
        <MetricLabel>Dragging:</MetricLabel>
        <MetricValue>
          {metrics.isDragging ? 'ACTIVE' : 'IDLE'}
          <StatusIndicator active={metrics.isDragging} />
        </MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel>BG Cache:</MetricLabel>
        <MetricValue>
          {metrics.backgroundCacheValid ? 'VALID' : 'BUILDING'}
          <StatusIndicator active={metrics.backgroundCacheValid} />
        </MetricValue>
      </MetricRow>
      
      <div style={{ 
        marginTop: '8px', 
        fontSize: '10px', 
        color: '#888',
        textAlign: 'center'
      }}>
        Updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
      </div>
      
      <div style={{
        marginTop: '6px',
        fontSize: '9px',
        color: '#666',
        textAlign: 'center'
      }}>
        {metrics.isDragging ? '🏃 Real-time preview active' : '⚡ Background cached'}
      </div>
    </DashboardContainer>
  );
};