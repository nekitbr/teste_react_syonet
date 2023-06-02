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
}

export default function Modal({ open, handleOpen, onYes, onNo, children, title }: ModalProps) {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
    >
      {title && <DialogHeader>{title}</DialogHeader>}
      <DialogBody divider={!!title}>{children}</DialogBody>
      <DialogFooter>
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
        {onYes && (
          <Button
            variant="gradient"
            color="blue"
            onClick={(event) => {
              event.stopPropagation()
              handleOpen(false)
              onYes()
            }}
          >
            <span>Confirm</span>
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  )
}
