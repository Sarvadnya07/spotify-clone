import { useState, useCallback, useEffect } from 'react';

/**
 * useContextMenu
 * Hook to manage the position and visibility of a custom context menu.
 * Automatically handles boundary checks to keep the menu on-screen.
 */
export const useContextMenu = () => {
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: any;
  }>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const showMenu = useCallback((e: React.MouseEvent, data: any) => {
    e.preventDefault();
    
    // Boundary checks
    let x = e.clientX;
    let y = e.clientY;
    const menuWidth = 200;
    const menuHeight = 250;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    setMenuState({
      visible: true,
      x,
      y,
      data,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (menuState.visible) {
      window.addEventListener('scroll', closeMenu);
      return () => window.removeEventListener('scroll', closeMenu);
    }
  }, [menuState.visible, closeMenu]);

  return {
    ...menuState,
    showMenu,
    closeMenu,
  };
};
