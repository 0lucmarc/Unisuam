# Programa para calcular a nota final de um aluno com base em duas provas

# Solicita ao usuário que insira as notas das duas provas
Nota1 = int(input("Digite a nota da prova 1 do aluno: "))
Nota2 = int(input("Digite a nota da prova 2 do aluno: "))

# Calcula a nota final como a média das duas notas
NotaFinal = (Nota1 + Nota2) / 2
print("A nota final do aluno é: ", NotaFinal)

# Determina a situação do aluno com base na nota final usando If, Elif e Else
if NotaFinal >= 7:
    print("Aprovado")
elif NotaFinal >= 4.5:
    print("Recuperação")
else:
    print("Reprovado")