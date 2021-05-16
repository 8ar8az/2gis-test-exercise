import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  WindowScroller,
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

import styles from './books-list.scss';

const useMeasurerCache = (ids) => {
  const idsRef = useRef(null);
  idsRef.current = ids;

  const measurerCache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 175,
    keyMapper: (rowIndex) => idsRef.current[rowIndex],
  }));

  return measurerCache.current;
};

const BooksList = React.memo(({ ids, renderBook }) => {
  const measurerCache = useMeasurerCache(ids);
  const listRef = useRef(null);

  useLayoutEffect(
    () => {
      if (listRef.current) {
        listRef.current.recomputeRowHeights();
      }
    },
    [ids],
  );

  const rowRenderer = ({
    index,
    key,
    style,
    parent,
  }) => (
    <CellMeasurer
      cache={measurerCache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ registerChild: ref }) => renderBook({ id: ids[index], style, ref })}
    </CellMeasurer>
  );

  const handleResizeList = () => {
    measurerCache.clearAll();

    if (listRef.current) {
      listRef.current.forceUpdateGrid();
    }
  };

  return (
    <WindowScroller>
      {({
        height,
        isScrolling,
        registerChild,
        scrollTop,
      }) => (
        <AutoSizer onResize={handleResizeList}>
          {({ width }) => (
            <div ref={registerChild}>
              <List
                ref={listRef}
                className={styles.root}
                autoHeight
                height={height}
                width={width}
                rowCount={ids.length}
                rowHeight={measurerCache.rowHeight}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
                isScrolling={isScrolling}
                deferredMeasurementCache={measurerCache}
                overscanRowCount={5}
              />
            </div>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
});

BooksList.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderBook: PropTypes.func.isRequired,
};

export default BooksList;
