import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { getInvitationBySlug, invitations } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return invitations.map((invitation) => ({
    slug: invitation.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = getInvitationBySlug(slug);

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
  const invitation = getInvitationBySlug(slug);

  if (!invitation || invitation.status !== "published") {
    notFound();
  }

  return <InvitationExperience invitation={invitation} />;
}
