import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/app-components/ui/input";
import { Label } from "@/components/app-components/ui/label";
import { Button } from "@/components/app-components/ui/button";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

export default function VideoIntro({
  vid,
  setVid,
  verified,
  setVerified,
}: {
  vid: string;
  setVid: (s: string) => void;
  verified: boolean;
  setVerified: Dispatch<SetStateAction<boolean>>;
}) {
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVid(event.target.value);
    setVerified(false);
  };

  const onClick = async () => {
    const isYtUrl = vid.match(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
    );
    if (isYtUrl) {
      try {
        const url = new URL(vid).searchParams;
        const ytVideoID = url.get("v");
        if (ytVideoID) {
          await isYouTubeVideoAvailable(ytVideoID);
        }
      } catch (error) {
        toast.error(`${vid} is not a valid video or couldn't be reached.`);
        console.error(error);
      }
    } else {
      toast.error(`${vid} is not a youtube link`);
    }
  };

  async function isYouTubeVideoAvailable(videoId: string) {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Video does not exist or is private.");
    setVerified(res.ok);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="ytlink">Video link</Label>
      <Input
        type="url"
        id="ytlink"
        value={vid}
        pattern="^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"
        onChange={inputHandler}
        placeholder="example link: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
      {vid && verified ? (
        <Button onClick={onClick} type="button">
          <BadgeCheck />
          Verified
        </Button>
      ) : (
        vid && (
          <Button onClick={onClick} type="button" variant="outline">
            Verify link
          </Button>
        )
      )}
    </div>
  );
}
