'use client';

import { useState, CSSProperties, ReactNode } from 'react';

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface FolderProps {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
}

interface PaperOffset {
  x: number;
  y: number;
}

const Folder = ({ color = '#5227FF', size = 1, items = [], className = '' }: FolderProps) => {
  const maxItems = 3;
  const papers: (ReactNode | null)[] = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<PaperOffset[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);

  const handleClick = () => {
    setOpen(prev => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  // Paper colors
  const paperColors = ['#e6e6e6', '#f2f2f2', '#ffffff'];

  // Get paper transform based on state and index
  const getPaperTransform = (index: number, isHovered: boolean = false): string => {
    if (!open) {
      return 'translate(-50%, 10%)';
    }

    const baseTransforms = [
      'translate(-120%, -70%) rotate(-15deg)',
      'translate(10%, -70%) rotate(15deg)',
      'translate(-50%, -100%) rotate(5deg)',
    ];

    const transform = baseTransforms[index] || baseTransforms[0];
    return isHovered ? `${transform} scale(1.1)` : transform;
  };

  // Get paper dimensions based on index
  const getPaperDimensions = (index: number): { width: string; height: string } => {
    const dimensions = [
      { width: '70%', height: '80%' },
      { width: '80%', height: open ? '80%' : '70%' },
      { width: '90%', height: open ? '80%' : '60%' },
    ];
    return dimensions[index] || dimensions[0];
  };

  return (
    <div style={{ transform: `scale(${size})` }} className={className}>
      <div
        className={`cursor-pointer transition-all duration-200 ease-in ${
          open ? '-translate-y-2' : 'hover:-translate-y-2'
        }`}
        onClick={handleClick}
      >
        {/* Folder back */}
        <div
          className="relative rounded-[0px_10px_10px_10px]"
          style={{
            width: '100px',
            height: '80px',
            backgroundColor: folderBackColor,
          }}
        >
          {/* Folder tab */}
          <div
            className="absolute z-0 rounded-t-[5px]"
            style={{
              bottom: '98%',
              left: 0,
              width: '30px',
              height: '10px',
              backgroundColor: folderBackColor,
            }}
          />

          {/* Papers */}
          {papers.map((item, i) => {
            const dims = getPaperDimensions(i);
            const offset = paperOffsets[i] || { x: 0, y: 0 };

            return (
              <div
                key={i}
                className="absolute z-[2] rounded-[10px] transition-all duration-300 ease-in-out hover:scale-110"
                style={{
                  bottom: '10%',
                  left: '50%',
                  width: dims.width,
                  height: dims.height,
                  backgroundColor: paperColors[i],
                  transform: getPaperTransform(i),
                  ...(open && {
                    '--magnet-x': `${offset.x}px`,
                    '--magnet-y': `${offset.y}px`,
                  } as CSSProperties),
                }}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
              >
                {item}
              </div>
            );
          })}

          {/* Folder front left */}
          <div
            className={`absolute z-[3] w-full h-full rounded-[5px_10px_10px_10px] origin-bottom transition-all duration-300 ease-in-out ${
              open ? 'skew-x-[15deg] scale-y-[0.6]' : 'group-hover:skew-x-[15deg] group-hover:scale-y-[0.6]'
            }`}
            style={{ backgroundColor: color }}
          />

          {/* Folder front right */}
          <div
            className={`absolute z-[3] w-full h-full rounded-[5px_10px_10px_10px] origin-bottom transition-all duration-300 ease-in-out ${
              open ? '-skew-x-[15deg] scale-y-[0.6]' : 'group-hover:-skew-x-[15deg] group-hover:scale-y-[0.6]'
            }`}
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
};

export default Folder;
