# Tests sur contrat "Voting"

Test portant sur le contrat "voting.sol" 
___

## Nombre de test effectué : 35


### 1) Test Sur Proposal

### 5 tests :

1. Vérifie si la session proposal est ouverte
2. Verifie si la proposition n'est pas vide
3. Vérifie si la proposition est bien enregistrer avec un expectEvent
4. Vérifie si la proposition est bien enregistrer avec le retour de getOneProposal
5. Vérifie si la session de proposition ce cloture bien et accepte aucune nouvelle proposition

___

### 2) Test Sur Voter

### 9 tests :

1. Verifie si la session de vote est ouverte
2. Verifie si le voteur est deja enregistré
3. Verifie si le voteur est bien enregistrer grace au retour d'un expectEvent
4. Verifie si le voteur est bien enregistrer avec la fonction getVoter qui doit retourner TRUE
5. Test sur la fonction setVote quand la session n'est pas ouverte
6. Essayer d'ouvrir la session de vote quand le proposal n'est pas fermé
7. Verifie si l'id du proposal exist
8. Check l'insertion d'un vote via un expectEvent
9. Verifie qu'on ne peut pas voter plusieur fois


___

### 3) Test Sur tallyVotes

### 3 tests :

1. Check la proposition Gagnante
2. Check Changement de status apres tirage au sort
3. Check si on peut tiré au sort avant la fin d'un vote


### 4) Test Sur REVERT Exception Only

### 10 tests :

1. Essai d'envoyer une requête sur getVoter si vous êtes pas Voters
2. Essai d'envoyer une requête sur getOneProposal si vous êtes pas Voters
3. Essai d'envoyer une requête sur addProposal si vous êtes pas Voters
4. Essai d'envoyer une requête sur setVote si vous êtes pas Voters
5. Essai d'envoyer une requête sur addVoter si vous êtes pas Owner
6. Essai d'envoyer une requête sur startProposalsRegistering si vous êtes pas Owner
7. Essai d'envoyer une requête sur endProposalsRegistering si vous êtes pas Owner
8. Essai d'envoyer une requête sur startVotingSession si vous êtes pas Owner
9. Essai d'envoyer une requête sur endVotingSession si vous êtes pas Owner
10. Essai d'envoyer une requête sur tallyVotes si vous êtes pas Owner


### 5) Test Sur les WorkflowStatus changement de status

### 8 tests :

1. Check changement de status de startProposalsRegistering
2. Check changement de status de endProposalsRegistering
3. Check changement de status de startVotingSession
4. Check changement de status de endVotingSession
5. Verifie l'erreur de retour d'activation startProposalsRegistering 
6. Verifie l'erreur de retour d'activation endProposalsRegistering 
7. Verifie l'erreur de retour d'activation startVotingSession 
8. Verifie l'erreur de retour d'activation endVotingSession 
