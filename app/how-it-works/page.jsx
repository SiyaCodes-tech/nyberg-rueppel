import React from 'react';
import { BookOpen, Key, FileSignature, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const MathBox = ({ children }) => (
  <div className="bg-gray-950 border border-gray-800 p-4 rounded-md font-mono text-green-400 text-sm md:text-base shadow-inner overflow-x-auto my-4">
    {children}
  </div>
);

const StepNumber = ({ num, icon }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/50">
      {num}
    </div>
    <div className="text-green-400 bg-gray-900 p-2 rounded-lg border border-gray-800">
      {icon}
    </div>
  </div>
);

const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12" />
);

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-full mb-6">
          <BookOpen size={40} className="text-green-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient">
          The Math Behind Nyberg-Rueppel
        </h1>
        <p className="text-xl text-gray-400">
          A step-by-step cryptographic guide.
        </p>
      </div>

      <div className="cyber-panel p-8 md:p-12 space-y-4">
        <section>
          <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <Shield className="text-green-400" /> Overview
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The Nyberg-Rueppel signature scheme is a variant of the widely known Digital Signature Algorithm (DSA). 
            However, it comes with a unique property: <strong>Message Recovery</strong>. Instead of sending a message 
            along with a separate signature, the message itself is mathematically embedded into the signature's components.
            When you verify the signature, the math automatically spits out the original message text!
          </p>
        </section>

        <Divider />

        <section>
          <StepNumber num="1" icon={<Key size={20} />} />
          <h3 className="text-2xl font-bold text-gray-100 mb-4">Key Generation</h3>
          <p className="text-gray-400 mb-2">
            Before anything can be signed, Alice must generate a secure set of cryptographic parameters and her personal public/private key pair.
          </p>
          
          <MathBox>
            <p>1. Generate large prime p, and prime q such that q | (p-1)</p>
            <p>2. Find generator g of order q</p>
            <p>3. Choose random private key x (1 &lt; x &lt; q)</p>
            <p>4. Compute public key y = g^x mod p</p>
          </MathBox>
          
          <p className="text-gray-400 text-sm">
            <strong>Explanation:</strong> Alice creates a massive mathematical playing field (prime <code>p</code> and generator <code>g</code>). 
            She picks a secret number <code>x</code>, and creates a public padlock <code>y</code> using modular exponentiation. 
          </p>
        </section>

        <Divider />

        <section>
          <StepNumber num="2" icon={<FileSignature size={20} />} />
          <h3 className="text-2xl font-bold text-gray-100 mb-4">Signing (Embedding the Message)</h3>
          <p className="text-gray-400 mb-2">
            Alice wants to sign a message <code>m</code>. Instead of hashing it like in standard DSA, she mathematically weaves it into the signature itself.
          </p>

          <MathBox>
            <p>1. Convert message string m into a Big Integer</p>
            <p>2. Choose random ephemeral k (1 &lt; k &lt; q)</p>
            <p>3. Compute r = (m · g^k) mod p</p>
            <p>4. Compute s = (k - r · x) mod q</p>
            <p>5. Signature is the pair (r, s)</p>
          </MathBox>

          <p className="text-gray-400 text-sm">
            <strong>Explanation:</strong> Alice picks a random, one-time-use secret number <code>k</code>. She masks her message <code>m</code> 
            by multiplying it by <code>g^k mod p</code> to create the first signature piece, <code>r</code>. 
            Then, she mathematically ties this <code>r</code> back to her original private key <code>x</code> to create the second piece, <code>s</code>.
          </p>
        </section>

        <Divider />

        <section>
          <StepNumber num="3" icon={<CheckCircle size={20} />} />
          <h3 className="text-2xl font-bold text-gray-100 mb-4">Verification & Message Recovery</h3>
          <p className="text-gray-400 mb-2">
            Bob receives the signature <code>(r, s)</code>. He knows Alice's public key <code>y</code>. He will now use math to "unlock" the signature and pop the message out.
          </p>

          <MathBox>
            <p>1. Compute (g^s · y^r) mod p</p>
            <p>2. Find modular inverse of the result from Step 1</p>
            <p>3. Recover m' = (r · inverse) mod p</p>
            <p>4. Convert integer m' back to text</p>
          </MathBox>

          <p className="text-gray-400 text-sm">
            <strong>Explanation:</strong> When Bob computes <code>g^s · y^r</code>, the math magically cancels out Alice's private key, 
            leaving exactly <code>g^k</code>! Since Bob now has <code>g^k</code>, he finds its mathematical inverse, and multiplies it against 
            the <code>r</code> piece of the signature. This strips away the mask Alice applied during signing, leaving behind the pure, unadulterated message integer <code>m'</code>.
          </p>
        </section>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
              <Shield size={18} /> Why Message Recovery?
            </h4>
            <p className="text-sm text-gray-400">
              In standard signatures (DSA/ECDSA), you must transmit the plaintext message along with the signature, and the signature merely proves you wrote it. 
              Nyberg-Rueppel combines transmission and authentication into a single data package. If the signature is tampered with, the recovered message will just be unreadable gibberish, instantly proving invalidity.
            </p>
          </div>

          <div className="bg-amber-900/10 p-6 rounded-lg border border-amber-900/50">
            <h4 className="font-bold text-amber-500 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} /> Security Basis
            </h4>
            <p className="text-sm text-gray-400">
              The entire scheme relies on the <strong>Discrete Logarithm Problem</strong>. Even if an attacker knows <code>g</code>, <code>p</code>, and the public key <code>y</code>, 
              it is computationally infeasible for modern computers to work backwards to figure out the private key <code>x</code>. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
