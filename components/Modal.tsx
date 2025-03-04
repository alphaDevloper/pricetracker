"use client";
import { addEmailToProduct } from "@/lib/actions";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import React, { FormEvent, Fragment, useState } from "react";

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  const openModel = () => setIsOpen(true);
  const closeModel = () => setIsOpen(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addEmailToProduct(productId, email);
    setIsSubmitting(false);
    setEmail("");
    closeModel();
  };
  return (
    <>
      <button type="button" className="btn" onClick={openModel}>
        Track
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModel} className="dialog-container">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel transition className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModel}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts right in your
                    inbox!
                  </h4>

                  <p className="text-sm text-gray-600 mt-2">
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>
                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />

                    <input
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="dialog-input"
                    />
                  </div>
                  <button className="dialog-btn" onClick={closeModel}>
                    {isSubmitting ? "Submitting..." : "Track"}
                  </button>
                </form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
