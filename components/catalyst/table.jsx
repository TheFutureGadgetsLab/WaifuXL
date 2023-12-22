'use client'

import { clsx } from 'clsx'
import { createContext, useContext, useState } from 'react'
import { Link } from './link'

const TableContext = createContext({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
})

export function Table({ bleed = false, dense = false, grid = false, striped = false, className, children, ...props }) {
  return (
    <TableContext.Provider value={{ bleed, dense, grid, striped }}>
      <div className="flow-root">
        <div {...props} className={clsx(className, '-mx-[--gutter] overflow-x-auto whitespace-nowrap')}>
          <div className={clsx('inline-block min-w-full align-middle', !bleed && 'sm:px-[--gutter]')}>
            <table className="min-w-full text-left text-sm/6">{children}</table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  )
}

export function TableHead({ className, ...props }) {
  return <thead className={clsx(className, 'text-zinc-500 dark:text-zinc-400')} {...props} />
}

export function TableBody(props) {
  return <tbody {...props} />
}

const TableRowContext = createContext({
  href: undefined,
  target: undefined,
  title: undefined,
})

export function TableRow({ href, target, title, className, children, ...props }) {
  let { striped } = useContext(TableContext)

  return (
    <TableRowContext.Provider value={{ href, target, title }}>
      <tr
        {...props}
        className={clsx(
          className,
          href &&
            'has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]',
          striped && 'even:bg-zinc-950/[2.5%] dark:even:bg-white/[2.5%]',
          href && striped && 'hover:bg-zinc-950/5 dark:hover:bg-white/5',
          href && !striped && 'hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]'
        )}
      >
        {children}
      </tr>
    </TableRowContext.Provider>
  )
}

export function TableHeader({ className, ...props }) {
  let { bleed, grid } = useContext(TableContext)

  return (
    <th
      {...props}
      className={clsx(
        className,
        'border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10',
        grid && 'border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5',
        !bleed && 'sm:first:pl-2 sm:last:pr-2'
      )}
    />
  )
}

export function TableCell({ className, children, ...props }) {
  let { bleed, dense, grid, striped } = useContext(TableContext)
  let { href, target, title } = useContext(TableRowContext)
  let [cellRef, setCellRef] = useState(null)

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      className={clsx(
        className,
        'relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]',
        !striped && 'border-b border-zinc-950/5 dark:border-white/5',
        grid && 'border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5',
        dense ? 'py-2.5' : 'py-4',
        !bleed && 'sm:first:pl-2 sm:last:pr-2'
      )}
    >
      {href && (
        <Link
          data-row-link
          href={href}
          target={target}
          aria-label={title}
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          className="absolute inset-0 focus:outline-none"
        />
      )}
      {children}
    </td>
  )
}
