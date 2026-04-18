"use client";

import { AuthUser } from "@/app/types";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { updateProfile } from "../actions/userActions";
import defaultAvatar from "../public/images/default-avatar.png";

export default function ProfileForm({ user }: { user: AuthUser }) {
  const [state, action, isPending] = useActionState(updateProfile, null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (formData: FormData) => {
    const name = formData.get("name")?.toString() ?? "";
    const username = formData.get("username")?.toString() ?? "";
    const bio = formData.get("bio")?.toString() ?? "";
    const photo = formData.get("photo") as File | null;
    const hasPhoto = photo && photo.size > 0;

    if (!name && !username && !bio && !hasPhoto) {
      toast.info("No changes to save");
      return;
    }

    action(formData);
  };

  useEffect(() => {
    if (!state) return;
    if ("message" in state) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form className="mt-4 space-y-6" action={handleSubmit}>
      <div className="bg-panel2 w-full rounded-2xl">
        <div className="flex items-center p-4">
          <div className="relative mr-5 h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={photoPreview || user.photo || defaultAvatar}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-text mb-2 text-xl font-extrabold">
              {user.name}
            </h2>
            <p className="text-muted font-body mb-2 text-sm">
              @{user.username}
            </p>
            <div className="flex items-center gap-x-4">
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e)}
                className="absolute -z-10 h-0 w-0 opacity-0"
              />
              <label
                htmlFor="photo"
                className="text-text cursor-pointer text-sm hover:underline"
              >
                Edit photo →
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="name"
        >
          Display name
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Edit your display name..."
        />
      </div>
      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="username"
        >
          Username
        </label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Edit your username..."
        />
      </div>
      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="bio"
        >
          Bio
        </label>
        <Input type="text" name="bio" id="bio" placeholder="Edit your bio..." />
      </div>
      {state && "error" in state && (
        <div className="flex flex-col gap-1">
          {state.error.split(".").map((err, i) => (
            <p key={i} className="text-danger text-sm">
              {err}
            </p>
          ))}
        </div>
      )}
      <Button type="submit">{isPending ? "Saving..." : "Save Changes"}</Button>
    </form>
  );
}
