'use client'

import {
  Description as HeadlessDescription,
  Label as HeadlessLabel,
  Menu as HeadlessMenu,
  MenuButton as HeadlessMenuButton,
  MenuHeading as HeadlessMenuHeading,
  MenuItem as HeadlessMenuItem,
  MenuItems as HeadlessMenuItems,
  MenuSection as HeadlessMenuSection,
  MenuSeparator as HeadlessMenuSeparator,
  Transition as HeadlessTransition,
} from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { Button } from './button'
import { Link } from './link'

export function Dropdown(props) {
  return <HeadlessMenu {...props} />
}

export function DropdownButton(props) {
  return <HeadlessMenuButton as={Button} {...props} />
}

export function DropdownMenu({ anchor = 'bottom', ...props }) {
  return (
    <HeadlessTransition as={Fragment} leave="duration-100 ease-in" leaveTo="opacity-0">
      <HeadlessMenuItems
        {...props}
        anchor={{
          to: anchor,
          gap: 'var(--anchor-gap)',
          offset: 'var(--anchor-offset)',
          padding: 'var(--anchor-padding)',
        }}
        className={clsx(
          props.className,

          // Anchor positioning
          '[--anchor-gap:theme(spacing.2)] [--anchor-padding:theme(spacing.3)] data-[anchor~=end]:[--anchor-offset:4px] data-[anchor~=start]:[--anchor-offset:-4px]',

          // Base styles
          'isolate w-max rounded-xl p-1',

          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          'outline outline-1 outline-transparent focus:outline-none',

          // Handle scrolling when menu won't fit in viewport
          'overflow-y-auto',

          // Popover background
          'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',

          // Shadows
          'shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10',

          // Define grid at the menu level if subgrid is supported
          'supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]'
        )}
      />
    </HeadlessTransition>
  )
}

export function DropdownItem(props) {
  return (
    <HeadlessMenuItem
      as={props.href ? Link : 'button'}
      type={props.href ? undefined : 'button'}
      {...props}
      className={clsx(
        props.className,

        // Base styles
        'group cursor-default rounded-lg px-3.5 py-2.5 focus:outline-none sm:px-3 sm:py-1.5',

        // Text styles
        'text-left text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',

        // Focus
        'data-[focus]:bg-blue-500 data-[focus]:text-white',

        // Disabled state
        'data-[disabled]:opacity-50',

        // Forced colors mode
        'forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-[focus]:text-[HighlightText]',

        // Use subgrid when available but fallback to an explicit grid layout if not
        'col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid',

        // Icon
        '[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:sm:size-4',
        '[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:data-[focus]:text-white [&>[data-slot=icon]]:dark:text-zinc-500 [&>[data-slot=icon]]:data-[focus]:dark:text-white'
      )}
    />
  )
}

export function DropdownHeader({ className, ...props }) {
  return <div {...props} className={clsx(className, 'col-span-5 px-3.5 pb-1 pt-2.5 sm:px-3')} />
}

export function DropdownSection({ className, ...props }) {
  return (
    <HeadlessMenuSection
      {...props}
      className={clsx(
        className,
        // Define grid at the section level instead of the item level if subgrid is supported
        'col-span-full supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]'
      )}
    />
  )
}

export function DropdownHeading({ className, ...props }) {
  return (
    <HeadlessMenuHeading
      {...props}
      className={clsx(
        className,
        'col-span-full grid grid-cols-[1fr,auto] gap-x-12 px-3.5 pb-1 pt-2 text-sm/5 font-medium text-zinc-500 sm:px-3 sm:text-xs/5 dark:text-zinc-400'
      )}
    />
  )
}

export function DropdownSeparator({ className, ...props }) {
  return (
    <HeadlessMenuSeparator
      {...props}
      className={clsx(
        className,
        'col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]'
      )}
    />
  )
}

export function DropdownLabel({ className, ...props }) {
  return (
    <HeadlessLabel {...props} data-slot="label" className={clsx(className, 'col-start-2 row-start-1')} {...props} />
  )
}

export function DropdownDescription({ className, ...props }) {
  return (
    <HeadlessDescription
      data-slot="description"
      {...props}
      className={clsx(
        className,
        'col-span-2 col-start-2 row-start-2 text-sm/5 text-zinc-500 group-data-[focus]:text-white sm:text-xs/5 dark:text-zinc-400 forced-colors:group-data-[focus]:text-[HighlightText]'
      )}
    />
  )
}

export function DropdownShortcut({ className, keys, ...props }) {
  return (
    <HeadlessDescription
      as="kbd"
      {...props}
      className={clsx(className, 'col-start-5 row-start-1 flex justify-self-end')}
    >
      {(Array.isArray(keys) ? keys : keys.split('')).map((char, index) => (
        <kbd
          key={index}
          className={clsx([
            'min-w-[2ch] text-center font-sans capitalize text-zinc-400 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[HighlightText]',

            // Make sure key names that are longer than one character (like "Tab") have extra space
            index > 0 && char.length > 1 && 'pl-1',
          ])}
        >
          {char}
        </kbd>
      ))}
    </HeadlessDescription>
  )
}
