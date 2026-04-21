import { Award, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function About() {
  const author = {
    name: 'Vinh',
    avatar: 'https://picsum.photos/id/64/300/300',
    bio: 'Lập trình viên Full-stack với niềm đam mê xây dựng những sản phẩm đẹp và hữu ích. Thích chia sẻ kiến thức về React, Tailwind, và các công nghệ hiện đại.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'Next.js', 'UI/UX'],
    social: {
      twitter: '#',
      github: '#',
      linkedin: '#',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h1 className="text-6xl font-bold tracking-tighter mb-6">
            Xin chào, tôi là Vinh
          </h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
            {author.bio}
          </p>

          <div className="flex gap-4 mb-12">
            <a
              href={author.social.github}
              target="_blank"
              className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 transition"
            >
              <FaGithub size={28} />
            </a>
            <a
              href={author.social.twitter}
              target="_blank"
              className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 transition"
            >
              <FaXTwitter size={28} />
            </a>
            <a
              href={author.social.linkedin}
              target="_blank"
              className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 transition"
            >
              <FaLinkedin size={28} />
            </a>
            <a
              href="mailto:your@email.com"
              className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 transition"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
