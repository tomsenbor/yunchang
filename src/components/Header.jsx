'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';

const headerNavigation = [
  { href: '/', label: '首页' },
  {
    id: 'ai-tools',
    label: 'AI工具',
    items: [
      { href: '/global-ai-tools', label: '全球AI工具' },
      { href: '/china-ai-tools', label: '国产AI工具' },
      { href: '/free-ai-tools', label: '免费工具' }
    ]
  },
  { href: '/ai-tools', label: 'AI模型库' },
  {
    id: 'learning',
    label: '学习资源',
    items: [
      { href: '/guides', label: '教程' },
      { href: '/videos', label: '视频解说' },
      { href: '/templates', label: '模板下载' }
    ]
  },
  { href: '/compare', label: '工具对比' }
];

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dropdownTriggerRefs = useRef(new Map());
  const keyboardFocusDropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!openDropdown || keyboardFocusDropdownRef.current !== openDropdown) return undefined;

    const focusFrame = requestAnimationFrame(() => {
      document.querySelector(`#site-nav-dropdown-${openDropdown} [role='menuitem']`)?.focus();
      keyboardFocusDropdownRef.current = null;
    });

    return () => cancelAnimationFrame(focusFrame);
  }, [openDropdown]);

  useEffect(() => {
    if (!isMenuOpen && !openDropdown) return undefined;

    const closeNavigation = () => {
      setIsMenuOpen(false);
      setOpenDropdown(null);
    };

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) closeNavigation();
    };

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      const activeDropdown = openDropdown;
      closeNavigation();

      if (activeDropdown) {
        dropdownTriggerRefs.current.get(activeDropdown)?.focus();
      } else {
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, openDropdown]);

  const isCurrent = (href) => (
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`)
  );

  const isGroupCurrent = (items) => items.some((item) => isCurrent(item.href));

  const handleDropdownKeyDown = (event, item) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      keyboardFocusDropdownRef.current = item.id;
      setOpenDropdown(item.id);
    }
  };

  const handleDropdownMouseEnter = (dropdownId) => {
    if (window.matchMedia('(min-width: 1180px)').matches) setOpenDropdown(dropdownId);
  };

  const handleDropdownMouseLeave = () => {
    if (window.matchMedia('(min-width: 1180px)').matches) setOpenDropdown(null);
  };

  const closeAllNavigation = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header ref={headerRef} className="site-header fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="site-header-inner">
        <div className="site-header-shell site-brand">
          <Link href="/" className="brand-trigger site-logo-button" aria-label="返回首页">
            <BrandMark />
            <span className="brand-copy">
              <span className="brand-cn">效率工具库</span>
              <span className="brand-en">EFFICIENCY TOOLS</span>
            </span>
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="site-menu-toggle"
          aria-label={isMenuOpen ? '关闭主导航菜单' : '打开主导航菜单'}
          aria-expanded={isMenuOpen}
          aria-controls="site-nav-panel"
          onClick={() => {
            setIsMenuOpen((open) => !open);
            setOpenDropdown(null);
          }}
        >
          <span aria-hidden="true" className="site-menu-icon">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="site-nav-panel"
          className="site-nav-panel"
          aria-label="主导航"
          data-open={isMenuOpen ? 'true' : 'false'}
        >
          <div className="site-nav-panel-inner">
            <div className="site-nav-primary">
              {headerNavigation.map((item) => {
                if (!item.items) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="site-nav-link"
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      onClick={closeAllNavigation}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="site-nav-dropdown"
                    data-open={openDropdown === item.id ? 'true' : 'false'}
                    data-current={isGroupCurrent(item.items) ? 'true' : 'false'}
                    onMouseEnter={() => handleDropdownMouseEnter(item.id)}
                    onMouseLeave={handleDropdownMouseLeave}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null);
                    }}
                  >
                    <button
                      ref={(node) => {
                        if (node) dropdownTriggerRefs.current.set(item.id, node);
                      }}
                      type="button"
                      className="site-nav-link site-nav-dropdown-trigger"
                      aria-label={`打开${item.label}菜单`}
                      aria-expanded={openDropdown === item.id}
                      aria-controls={`site-nav-dropdown-${item.id}`}
                      onClick={() => setOpenDropdown((current) => (current === item.id ? null : item.id))}
                      onKeyDown={(event) => handleDropdownKeyDown(event, item)}
                    >
                      <span>{item.label}</span>
                      <span className="site-nav-chevron" aria-hidden="true" />
                    </button>

                    <div
                      id={`site-nav-dropdown-${item.id}`}
                      className="site-nav-dropdown-menu"
                      role="menu"
                      aria-label={`${item.label}子菜单`}
                    >
                      {item.items.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="site-nav-dropdown-link"
                          role="menuitem"
                          aria-current={isCurrent(child.href) ? 'page' : undefined}
                          onClick={closeAllNavigation}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="site-nav-actions">
              <Link
                href="/contact"
                className="site-nav-action"
                aria-current={isCurrent('/contact') ? 'page' : undefined}
                onClick={closeAllNavigation}
              >
                投稿合作
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
