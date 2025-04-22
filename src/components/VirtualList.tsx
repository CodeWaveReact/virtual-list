import React, { useRef, useState } from 'react';
import './VirtualList.css';

const VirtualList = () => {
  const [listHeight, setListHeight] = useState(500);
  const [itemHeight, setItemHeight] = useState(50);
  const [itemCount, setItemCount] = useState(10000);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollToIndex, setScrollToIndex] = useState<string>('');

  const visibleItemCount = Math.ceil(listHeight / itemHeight) + 1;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount, itemCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleScrollTo = () => {
    const index = parseInt(scrollToIndex);
    if (!isNaN(index) && index >= 1) {
      const targetIndex = Math.min(index, itemCount);
      const newScrollTop = (targetIndex - 1) * itemHeight;
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: newScrollTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const items = [];
  for (let i = startIndex; i < endIndex; i++) {
    items.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${i * itemHeight}px`,
          height: `${itemHeight}px`,
          width: '100%',
          padding: '0 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <div className="item-content">
          <div>Item {i + 1}</div>
          <div className="item-index">Index: {i}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="virtual-list-container">
      <div className="controls">
        <div className="control-group">
          <label>List Height: {listHeight}px</label>
          <input
            type="range"
            min="100"
            max="1000"
            value={listHeight}
            onChange={(e) => setListHeight(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Item Size: {itemHeight}px</label>
          <input
            type="range"
            min="20"
            max="100"
            value={itemHeight}
            onChange={(e) => setItemHeight(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Item Count: {itemCount}</label>
          <input
            type="range"
            min="100"
            max="50000"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
          />
        </div>

        <div className="scroll-control">
          <label>Scroll to Index:</label>
          <input
            type="text"
            value={scrollToIndex}
            onChange={(e) => setScrollToIndex(e.target.value)}
            placeholder="Enter index"
          />
          <button onClick={handleScrollTo}>Scroll To</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="virtual-list"
        style={{ height: `${listHeight}px` }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${itemCount * itemHeight}px`, position: 'relative' }}>
          {items}
        </div>
      </div>
      
      <div className="info-text">
        This virtual list renders {itemCount} items but only creates DOM nodes for the visible ones.
        <br />
        Try scrolling quickly to see how it efficiently renders only what's needed.
      </div>
    </div>
  );
};

export default VirtualList; 