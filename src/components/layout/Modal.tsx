import type { ReactElement } from 'react'
import { MouseEvent, useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '../material-tailwind/components'

interface ModalProps {
  open: boolean
  handleOpen: (open: boolean) => void
  onYes?: () => void
  onNo?: () => void
  children: ReactElement
  title?: ReactElement | string
  className?: string
}

export default function Modal({ className, open, handleOpen, onYes, onNo, children, title }: ModalProps) {
  return (
    <Dialog
      className={className}
      open={open}
      handler={handleOpen}
      size="lg"
    >
      {title && <DialogHeader>{title}</DialogHeader>}
      <DialogBody
        className="p-2 md:p-4"
        divider={!!title}
      >
        {children}
      </DialogBody>
      <DialogFooter className="gap-3">
        {!onYes && !onNo && (
          <Button
            variant="filled"
            color="blue"
            onClick={(event) => {
              event.stopPropagation()
              handleOpen(false)
            }}
            className="mr-1"
          >
            <span>Ok</span>
          </Button>
        )}
        {onYes && (
          <Button
            variant="gradient"
            color="green"
            onClick={(event) => {
              event.stopPropagation()
              handleOpen(false)
              onYes()
            }}
          >
            <span>Save</span>
          </Button>
        )}
        {onNo && (
          <Button
            variant="filled"
            color="red"
            onClick={(event) => {
              event.stopPropagation()
              handleOpen(false)
              onNo()
            }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  )
}
