"use client"


import { Button } from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import { FC, useEffect, useState } from 'react'

interface AlertModalProps {
  isOpen: boolean,
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}: AlertModalProps) => {

  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }


  return (
    <Modal
      title="Are your sure?"
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  )
}

export default AlertModal