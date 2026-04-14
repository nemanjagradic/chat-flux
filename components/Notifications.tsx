"use client";

import { useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { MdNotifications, MdGroup, MdDoNotDisturb } from "react-icons/md";
import Header from "./UI/Header";
import SettingItem from "./UI/SettingItem";
import { updateNotificationSettings } from "../actions/userActions";
import { AuthUser } from "@/app/types";

export default function Notifications({ user }: { user: AuthUser }) {
  const [messageSounds, setMessageSounds] = useState(user.messageSounds);
  const [notificationSound, setNotificationSound] = useState(
    user.notificationSound,
  );
  const [desktopNotifications, setDesktopNotifications] = useState(
    user.desktopNotifications,
  );
  const [groupAlerts, setGroupAlerts] = useState(user.groupAlerts);
  const [doNotDisturb, setDoNotDisturb] = useState(user.doNotDisturb);

  const handleToggle = async (field: string, value: boolean) => {
    const formData = new FormData();
    formData.append(field, String(value));
    await updateNotificationSettings(null, formData);
  };

  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Notifications</Header>
        <div className="mt-4 mb-6">
          <p className="font-display text-muted mb-1 divide-y text-xs tracking-widest uppercase">
            Sound
          </p>
          <div className="bg-panel border-accent/10 divide-accent/10 rounded-2xl border">
            <SettingItem
              label="Message Sounds"
              description="Play a sound when a message arrives and tab is active"
              enabled={messageSounds && !doNotDisturb}
              disabled={doNotDisturb}
              onToggle={() => {
                if (doNotDisturb) return;
                const newValue = !messageSounds;
                setMessageSounds(newValue);
                handleToggle("messageSounds", newValue);
              }}
              icon={HiSpeakerWave}
              iconBg="bg-accent/20"
              borderBottom="border-b border-accent/20"
            />
            <SettingItem
              label="Notification Sound"
              description="Play a sound when a desktop notification fires"
              enabled={notificationSound && !doNotDisturb}
              disabled={doNotDisturb}
              onToggle={() => {
                if (doNotDisturb) return;
                const newValue = !notificationSound;
                setNotificationSound(newValue);
                handleToggle("notificationSound", newValue);
              }}
              icon={HiSpeakerXMark}
              iconBg="bg-accent/20"
            />
          </div>
        </div>
        <div className="mb-6">
          <p className="font-display text-muted mb-1 text-xs tracking-widest uppercase">
            Desktop Notifications
          </p>
          <div className="bg-panel border-accent/10 rounded-2xl border">
            <SettingItem
              label="Desktop Notifications"
              description="Show browser notifications when tab is in background"
              enabled={desktopNotifications && !doNotDisturb}
              disabled={doNotDisturb}
              onToggle={() => {
                if (doNotDisturb) return;
                const newValue = !desktopNotifications;
                setDesktopNotifications(newValue);
                if (newValue && Notification.permission === "default") {
                  Notification.requestPermission();
                }
                handleToggle("desktopNotifications", newValue);
              }}
              icon={MdNotifications}
              iconBg="bg-purple-500/20"
              borderBottom="border-b border-accent/20"
            />
            <SettingItem
              label="Group Message Alerts"
              description="Also notify for group messages, not just direct messages"
              enabled={groupAlerts && !doNotDisturb}
              disabled={doNotDisturb}
              onToggle={() => {
                if (doNotDisturb) return;
                const newValue = !groupAlerts;
                setGroupAlerts(newValue);
                handleToggle("groupAlerts", newValue);
              }}
              icon={MdGroup}
              iconBg="bg-purple-500/20"
            />
          </div>
        </div>
        <div>
          <p className="font-display text-muted mb-1 text-xs tracking-widest uppercase">
            Do Not Disturb
          </p>
          <div className="bg-panel border-accent/10 rounded-2xl border">
            <SettingItem
              label="Do Not Disturb"
              description="Silence all sounds and notifications"
              enabled={doNotDisturb}
              onToggle={() => {
                const newValue = !doNotDisturb;
                setDoNotDisturb(newValue);
                handleToggle("doNotDisturb", newValue);
              }}
              icon={MdDoNotDisturb}
              iconBg="bg-danger/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
