"use client";

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#f4f8f7] pointer-events-none">
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-gradient-mesh-1 blur-[120px] animate-mesh-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-gradient-mesh-2 blur-[120px] animate-mesh-slower" />
        <div className="absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-mesh-3 blur-[100px] animate-mesh-slowest shadow-[0_0_150px_rgba(0,104,95,0.15)]" />
      </div>

      {/* Architectural Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-1"
        style={{
          backgroundImage: `radial-gradient(#00685f 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 border-2 border-[#00685f]/10 rounded-3xl rotate-12 animate-float-slow opacity-20" />
      <div className="absolute bottom-[20%] left-[15%] w-24 h-24 border-2 border-blue-500/10 rounded-full animate-float-slower opacity-20" />
      <div className="absolute top-[25%] right-[20%] w-40 h-40 border-2 border-purple-500/10 rounded-[40px] -rotate-12 animate-float opacity-20" />
      
      <style jsx>{`
        @keyframes mesh {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 10%) scale(1.1); }
          66% { transform: translate(-10%, 5%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-mesh-slow { animation: mesh 15s ease-in-out infinite; }
        .animate-mesh-slower { animation: mesh 20s ease-in-out infinite; }
        .animate-mesh-slowest { animation: mesh 25s ease-in-out infinite; }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, 20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-float-slow { animation: float 12s ease-in-out infinite; }
        .animate-float-slower { animation: float 15s ease-in-out infinite; }
        .animate-float { animation: float 10s ease-in-out infinite; }

        .bg-gradient-mesh-1 { background: radial-gradient(circle at center, rgba(0, 104, 95, 0.2) 0%, transparent 70%); }
        .bg-gradient-mesh-2 { background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%); }
        .bg-gradient-mesh-3 { background: radial-gradient(circle at center, rgba(0, 104, 95, 0.1) 0%, transparent 70%); }
      `}</style>
    </div>
  );
}
