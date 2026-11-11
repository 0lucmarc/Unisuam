
ano = int(input("Digite o ano atual: "))
Idade1 = int(input("Digite a idade: "))
Idade2 = int(input("Digite a idade de aposentadoria: "))
faltam=Idade2 - Idade1
print("Faltam", faltam, "anos para a pessoa se aposentar.")
A = ano
while A < ano + faltam:
    print(A)
    A += 1
A = ano + faltam
print("A pessoa se aposentará no ano de", A)
