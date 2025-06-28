import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useLayoutEffect(() => {
        function updateSize() {
            setSize([
                window.innerWidth,
                window.innerHeight,
                // Visual viewport only works on top level
                window.visualViewport?.width ?? 0,
                window.visualViewport?.height ?? 0,
            ]);
        }

        window.addEventListener('resize', updateSize);
        window.visualViewport?.addEventListener('resize', updateSize);

        updateSize();

        return () => {
            window.removeEventListener('resize', updateSize);
            window.visualViewport?.removeEventListener('resize', updateSize);
        };
    }, []);
    return size;
};
