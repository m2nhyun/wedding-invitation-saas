import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { getInvitationBySlug, getStaticInvitationParams } from "@/lib/invitations";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getStaticInvitationParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return {
      title: "청첩장을 찾을 수 없습니다",
    };
  }

  const title = `${invitation.couple.groom.name} & ${invitation.couple.bride.name} 결혼합니다`;
  const description = `${invitation.wedding.venue} ${invitation.wedding.hall} · ${invitation.wedding.date}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: invitation.images.hero,
          width: 1200,
          height: 1600,
          alt: title,
        },
      ],
    },
  };
}

export default async function WeddingInvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation || invitation.status !== "published") {
    notFound();
  }

  return <InvitationExperience invitation={invitation} />;
}
