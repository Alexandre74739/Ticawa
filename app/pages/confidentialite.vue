<template>
  <LegalPage
    title="Confidentialité"
    title-accent="vos données restent les vôtres."
    intro="Ticawa conserve des documents personnels : vos tickets, vos factures, vos achats. Voici quelles données sont traitées, pourquoi, combien de temps, et comment exercer vos droits."
  >
    <LegalSection title="Responsable du traitement">
      <p>
        <strong>Alexandre-Philippe Perez</strong>, entrepreneur individuel
        exerçant sous le nom commercial Fablioo, Terr. Jean Renaudie, 38400
        Saint-Martin-d'Hères, France.
      </p>
      <p>
        Contact :
        <a href="mailto:perezalexandre430@gmail.com"
          >perezalexandre430@gmail.com</a
        >
      </p>
    </LegalSection>

    <LegalSection title="Données collectées">
      <h3>Quand vous visitez le site</h3>
      <ul>
        <li>
          Des données techniques de connexion (adresse IP, type de navigateur,
          pages consultées), enregistrées par l'hébergeur pour assurer le
          fonctionnement et la sécurité du site.
        </li>
        <li>Une mesure d'audience anonyme, sans cookie.</li>
      </ul>
      <h3>Quand vous créez et utilisez un compte</h3>
      <ul>
        <li>Votre adresse email et votre nom.</li>
        <li>Les photos de vos tickets de caisse et factures.</li>
        <li>
          Les informations sur vos produits (nom, marque, modèle, catégorie,
          date d'achat, prix) et sur leurs garanties et assurances.
        </li>
        <li>Vos préférences de rappel.</li>
      </ul>
      <UiLabelCard tone="trust">
        <p>Ticawa ne vous demande jamais de données bancaires.</p>
      </UiLabelCard>
    </LegalSection>

    <LegalSection title="Pourquoi ces données">
      <h3>Fournir le service</h3>
      <p>
        Conserver vos preuves d'achat, calculer les dates de fin de garantie et
        vous envoyer les alertes.
        <strong>Base légale :</strong> l'exécution des conditions d'utilisation
        que vous acceptez.
      </p>
      <h3>Sécurité et mesure d'audience</h3>
      <p>
        Assurer le bon fonctionnement du site et mesurer son audience de façon
        anonyme. <strong>Base légale :</strong> l'intérêt légitime de l'éditeur.
      </p>
      <UiLabelCard tone="trust">
        <p>
          Vos données ne sont ni vendues, ni louées, ni utilisées à des fins
          publicitaires ou de profilage.
        </p>
      </UiLabelCard>
    </LegalSection>

    <LegalSection title="Durée de conservation">
      <ul>
        <li>
          <strong>Données du compte :</strong> conservées tant que votre compte
          existe, puis supprimées automatiquement et définitivement quand vous
          le supprimez.
        </li>
        <li>
          <strong>Données techniques de connexion :</strong> conservées par
          l'hébergeur pour une durée limitée, nécessaire à la sécurité du site.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Qui a accès à vos données">
      <p>
        Seul l'éditeur de Ticawa y a accès, ainsi que les prestataires
        techniques strictement nécessaires au service, dans la limite de leur
        mission :
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (États-Unis) : hébergement du site.
        </li>
        <li>
          Les prestataires de stockage des données, d'authentification, d'envoi
          des alertes et de mesure d'audience, qui seront listés ici dès leur
          choix définitif.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Transferts hors UE">
      <p>
        Les données de votre compte (tickets, factures, produits) sont hébergées
        dans l'Union européenne.
      </p>
      <p>
        L'hébergeur du site, Vercel Inc., est une société américaine : les
        données techniques de connexion peuvent donc être traitées aux
        États-Unis. Ce transfert est encadré par les garanties prévues par le
        RGPD, notamment les clauses contractuelles types de la Commission
        européenne.
      </p>
    </LegalSection>

    <LegalSection title="Cookies">
      <p>
        Ticawa n'utilise aucun cookie publicitaire ni de traçage : c'est
        pourquoi aucun bandeau de consentement ne s'affiche.
      </p>
      <p>
        Seuls des cookies strictement nécessaires au fonctionnement, comme celui
        qui garde votre session connectée, peuvent être utilisés.
      </p>
    </LegalSection>

    <LegalSection title="Vos droits">
      <p>Conformément au RGPD, vous pouvez à tout moment :</p>
      <ul>
        <li>accéder à vos données et en obtenir une copie ;</li>
        <li>les rectifier si elles sont inexactes ;</li>
        <li>les supprimer, en supprimant votre compte ;</li>
        <li>les exporter dans un format réutilisable (portabilité) ;</li>
        <li>vous opposer à un traitement ou demander sa limitation ;</li>
        <li>
          définir des directives sur le sort de vos données après votre décès.
        </li>
      </ul>
      <UiLabelCard>
        <p>
          L'export et la suppression se font directement depuis l'application.
          Pour toute autre demande, écrivez à
          <a href="mailto:perezalexandre430@gmail.com"
            >perezalexandre430@gmail.com</a
          >
          : une réponse vous est apportée sous un mois maximum.
        </p>
      </UiLabelCard>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        adresser une réclamation à la CNIL (<a
          href="https://www.cnil.fr"
          target="_blank"
          rel="noopener"
          >cnil.fr</a
        >).
      </p>
    </LegalSection>

    <LegalSection title="Sécurité">
      <p>
        Les échanges avec le site sont chiffrés (HTTPS) et l'accès aux données
        est limité à ce qui est nécessaire au service.
      </p>
    </LegalSection>

    <LegalSection title="Modifications">
      <p>
        Cette politique peut évoluer avec le service. En cas de changement
        important, vous en serez informé dans l'application ou par email.
      </p>
    </LegalSection>
  </LegalPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Politique de confidentialité",
  description:
    "Comment Ticawa traite vos données personnelles : données collectées, finalités, durée de conservation, hébergement et droits RGPD.",
});
</script>
