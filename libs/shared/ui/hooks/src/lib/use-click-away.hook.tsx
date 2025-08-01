import { useEffect } from 'react';

export const useClickAway = (
    ref: React.RefObject<HTMLElement>,
    callback: () => void
) => {
    useEffect(() => {
        const handleClickAway = (event: MouseEvent) => {
            if (!ref.current) return;

            // Stop clicks inside the modal from propagating
            
            if (
                ref.current &&
                event.target instanceof Node &&
                ref.current.contains(event.target)
            )
                return;

            // Ignore clicks on elements marked to be excluded from click-away
            if (
                (event.target as HTMLElement).closest(
                    '[data-ignore-click-away]'
                )
            )
                return;

            callback();
        };

        document.addEventListener('mousedown', handleClickAway);
        return () => {
            document.removeEventListener('mousedown', handleClickAway);
        };
    }, [ref, callback]);
};
