'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Coins,
  Globe,
  Image as ImageIcon,
  Shield,
  Wallet,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';

const sections = [
  {
    id: 'intro',
    title: 'Što je Solana?',
    icon: Zap,
    content: {
      overview:
        'Solana je brza, sigurna i pristupačna blockchain platforma koja omogućava ljudima da stvaraju i koriste digitalne aplikacije bez složenog kodiranja.',
      keyPoints: [
        'Brza: Tisće transakcija u sekundi',
        'Jeftina: Transakcije koštaju manje od centa',
        'Ekološka: Energetski učinkovita',
        'Otvorena: Svatko može sudjelovati',
      ],
      analogy:
        'Zamislite Solanu kao "internet za novac i digitalnu imovinu" - baš kao što internet omogućava dijeljenje informacija, Solana omogućava dijeljenje vrijednosti.',
    },
  },
  {
    id: 'wallet',
    title: 'Što je Wallet (Novčanik)?',
    icon: Wallet,
    content: {
      overview:
        'Wallet je kao vaš digitalni novčanik - mjesto gdje držite svoj digitalni novac, tokene i NFT-ove. Siguran je, privatni i potpuno pod vašom kontrolom.',
      keyPoints: [
        'Siguran: Zaštićen lozinkom i ključevima',
        'Privatni: Samo vi imate pristup',
        'Prijenosiv: Koristite ga bilo gdje',
        'Trajni: Vaši podaci su na blockchainu zauvijek',
      ],
      analogy:
        'Zamislite wallet kao kombinaciju bankovnog računa i osobne kartice - držite svoj novac, ali također možete dokazati da ste vi vlasnik.',
    },
  },
  {
    id: 'tokens',
    title: 'Što su Tokeni?',
    icon: Coins,
    content: {
      overview:
        'Tokeni su digitalni novčići koje možete kreirati i koristiti na Solani. Svaki token može predstavljati bilo što - od valute do nagrada u igri.',
      keyPoints: [
        'Kreiranje: Svatko može kreirati svoj token',
        'Transfer: Lako slanje drugima',
        'Vrijednost: Može imati stvarnu vrijednost',
        'Programabilni: Može imati posebna pravila',
      ],
      analogy:
        'Zamislite token kao žeton u arkadi - možete ga koristiti za određene stvari, možete ga podijeliti s prijateljima, i možete ga sakupiti.',
    },
  },
  {
    id: 'nft',
    title: 'Što su NFT-ovi?',
    icon: ImageIcon,
    content: {
      overview:
        'NFT (Non-Fungible Token) je jedinstveni digitalni predmet koji dokazuje da ste vlasnik nečega - slike, glazbe, umjetnosti ili bilo čega drugog.',
      keyPoints: [
        'Jedinstveni: Svaki NFT je različit',
        'Vlasništvo: Dokaz da ste vlasnik',
        'Kolekcionarski: Možete ih sakupiti',
        'Trgovanje: Možete ih prodati ili kupiti',
      ],
      analogy:
        'Zamislite NFT kao digitalni potpis na umjetnini - dokazuje da je original vaš, čak i ako se kopija može napraviti.',
    },
  },
  {
    id: 'security',
    title: 'Sigurnost i Privatnost',
    icon: Shield,
    content: {
      overview:
        'Solana koristi najnapredniju kriptografiju za zaštitu vaših sredstava. Vaši podaci su sigurni, ali važno je znati kako se zaštititi.',
      keyPoints: [
        'Kriptografija: Najnaprednija zaštita',
        'Privatni ključevi: Držite ih sigurno',
        'Transparentnost: Sve je javno, ali anonimno',
        'Odgovornost: Vi ste odgovorni za svoj wallet',
      ],
      analogy:
        'Zamislite privatni ključ kao ključ od sefa - ako ga izgubite, ne možete pristupiti svojim sredstvima. Ako ga netko drugi dobije, može pristupiti vašim sredstvima.',
    },
  },
  {
    id: 'ecosystem',
    title: 'Solana Ekosistem',
    icon: Globe,
    content: {
      overview:
        'Solana ekosistem je zajednica projekata, aplikacija i ljudi koji rade zajedno na izgradnji budućnosti decentraliziranog interneta.',
      keyPoints: [
        'Aplikacije: Tisuće projekata',
        'Zajednica: Milijuni korisnika',
        'Inovacije: Stalno rastuće',
        'Pristupačnost: Otvoreno za sve',
      ],
      analogy:
        'Zamislite Solana ekosistem kao trgovački centar - ima različite trgovine (aplikacije), ljude koji posjećuju (korisnici), i sve radi zajedno.',
    },
  },
];

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (id: string) => {
    if (activeSection === id) {
      setActiveSection(null);
    } else {
      setActiveSection(id);
      setCompletedSections((prev) => new Set(prev).add(id));
    }
  };

  return (
    <div className='min-h-screen py-12 px-4 md:px-8 lg:px-12'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6'>
            Nauči <span className='text-purple-300'>Osnove Solane</span>
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto'>
            Jednostavna objašnjenja za obične ljude. Bez tehničkog žargona, bez
            kompliciranja.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className='bg-gray-800 rounded-full h-3 overflow-hidden'>
            <motion.div
              className='bg-gradient-to-r from-purple-500 to-fuchsia-600 h-full'
              initial={{ width: 0 }}
              animate={{
                width: `${(completedSections.size / sections.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className='text-sm text-gray-400 mt-2 text-center'>
            Progres: {completedSections.size} / {sections.length} sekcija
          </p>
        </motion.div>

        {/* Learning Sections */}
        <div className='space-y-6'>
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300',
                  isActive
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'border-gray-700 hover:border-purple-500/50',
                )}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className='w-full p-6 flex items-center justify-between text-left'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={cn(
                        'p-3 rounded-xl transition-colors',
                        isActive
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-gray-700/50 text-gray-400',
                      )}
                    >
                      <Icon className='w-6 h-6' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-white mb-1'>
                        {section.title}
                      </h2>
                      <p className='text-gray-400 text-sm'>Klikni za detalje</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    {isCompleted && (
                      <CheckCircle className='w-6 h-6 text-green-400' />
                    )}
                    <ArrowRight
                      className={cn(
                        'w-6 h-6 transition-transform',
                        isActive && 'rotate-90',
                      )}
                    />
                  </div>
                </button>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='px-6 pb-6 border-t border-gray-700 pt-6'
                  >
                    <div className='space-y-6'>
                      <p className='text-lg text-gray-200 leading-relaxed'>
                        {section.content.overview}
                      </p>

                      <div className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-4'>
                        <p className='text-purple-200 font-medium mb-2'>
                          💡 Analogija:
                        </p>
                        <p className='text-gray-300 italic'>
                          {section.content.analogy}
                        </p>
                      </div>

                      <div>
                        <h3 className='text-xl font-semibold text-white mb-4'>
                          Ključne karakteristike:
                        </h3>
                        <ul className='space-y-2'>
                          {section.content.keyPoints.map((point, idx) => (
                            <li
                              key={idx}
                              className='flex items-start gap-3 text-gray-300'
                            >
                              <CheckCircle className='w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0' />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className='bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-2xl p-8 border border-purple-500/30'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Spremni za početak?
            </h2>
            <p className='text-gray-300 mb-6 text-lg'>
              Kreirajte svoj wallet i počnite koristiti Solanu u manje od 2
              minute!
            </p>
            <Button
              variant='primary'
              className='bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg px-8 py-4 rounded-xl'
              as='a'
              href='/wallet'
            >
              Kreiraj Wallet →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
