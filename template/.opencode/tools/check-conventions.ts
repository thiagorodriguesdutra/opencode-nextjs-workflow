import { tool } from "@opencode-ai/plugin"
// @ts-ignore
import { execSync } from "child_process"

export default tool({
  description: "Verifica violações das convenções do projeto: cores hardcoded e imports diretos de lucide-react",
  args: {},
  async execute(args, context) {
    let colors = ""
    try {
      colors = execSync("npm run colors:check", { encoding: "utf-8", cwd: context.directory })
    } catch (e: any) {
      colors = e.stdout || e.message
    }

    let lucideViolations = ""
    try {
      lucideViolations = execSync(`rg 'from "lucide-react"' --glob '!**/icons.tsx'`, { encoding: "utf-8", cwd: context.directory })
    } catch {
      lucideViolations = ""
    }

    const violations = []
    if (colors.toLowerCase().includes("erro") || colors.toLowerCase().includes("hardcoded")) {
      violations.push("Cores hardcoded encontradas")
    }
    if (lucideViolations.trim()) {
      violations.push(`Import direto de lucide-react em: ${lucideViolations.trim()}`)
    }

    return violations.length ? violations.join("\n") : "Sem violações de convenção."
  },
})
