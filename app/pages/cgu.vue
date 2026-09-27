<template>
  <LegalPage
    title="Conditions d'utilisation"
    title-accent="les règles du jeu, simplement."
    intro="Ces conditions encadrent l'utilisation du site et de l'application Ticawa. Créer un compte implique de les accepter."
  >
    <LegalSection title="Éditeur">
      <p>
        Ticawa est édité par Alexandre-Philippe Perez (Fablioo). Les coordonnées
        complètes figurent dans les
        <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>.
      </p>
    </LegalSection>

    <LegalSection title="Le service">
      <p>
        Ticawa permet de conserver ses preuves d'achat, de savoir quelles
        garanties et assurances couvrent chaque produit et jusqu'à quand, et
        d'être prévenu avant leur expiration.
      </p>
      <UiLabelCard tone="trust">
        <p>
          Ticawa est un projet bénévole : le service est
          <strong>gratuit</strong>, sans publicité, et le restera.
        </p>
      </UiLabelCard>
      <p>Le coût de votre connexion internet reste à votre charge.</p>
    </LegalSection>

    <LegalSection title="Ce que Ticawa fait, et ne fait pas">
      <h3>Ce que Ticawa fait</h3>
      <p>
        Ticawa <strong>informe et alerte</strong>. Les dates de fin de garantie
        sont calculées à partir des informations que vous saisissez et des
        règles générales applicables : elles sont indicatives.
      </p>
      <h3>Ce que Ticawa ne fait pas</h3>
      <ul>
        <li>
          Aucune démarche auprès d'un vendeur, fabricant ou assureur à votre
          place.
        </li>
        <li>Aucun conseil juridique personnalisé.</li>
        <li>
          Aucune promesse qu'une demande de garantie ou d'indemnisation sera
          acceptée.
        </li>
      </ul>
      <UiLabelCard>
        <p>
          Certains vendeurs ou assureurs peuvent exiger le document original :
          pour les achats importants, conservez-le aussi.
        </p>
      </UiLabelCard>
    </LegalSection>

    <LegalSection title="Votre compte">
      <p>
        Vous vous engagez à fournir une adresse email valide et à garder vos
        identifiants confidentiels. Le compte est personnel.
      </p>
      <p>
        Vous pouvez supprimer votre compte à tout moment depuis l'application.
        Toutes vos données sont alors supprimées définitivement.
      </p>
    </LegalSection>

    <LegalSection title="Utilisation du service">
      <p>En utilisant Ticawa, vous vous engagez à :</p>
      <ul>
        <li>n'y enregistrer que des contenus licites ;</li>
        <li>
          ne pas tenter de perturber le service ou d'accéder aux données
          d'autres utilisateurs.
        </li>
      </ul>
      <p>
        En cas de manquement, l'éditeur peut suspendre ou supprimer le compte
        concerné.
      </p>
    </LegalSection>

    <LegalSection title="Vos contenus">
      <p>
        Vous restez propriétaire des documents et informations que vous
        enregistrez. Ils sont utilisés uniquement pour faire fonctionner le
        service à votre profit.
      </p>
    </LegalSection>

    <LegalSection title="Disponibilité et responsabilité">
      <p>
        L'éditeur fait de son mieux pour que Ticawa soit disponible et fiable,
        sans pouvoir le garantir en permanence : le service peut être interrompu
        pour maintenance, évoluer ou être modifié.
      </p>
      <p>
        Les notifications dépendent aussi des réglages de votre appareil. Dans
        les limites permises par la loi, l'éditeur ne peut être tenu responsable
        d'une perte de droits liée à une information inexacte saisie, à une
        alerte non reçue ou à une décision prise sur la seule base des
        indications de Ticawa.
      </p>
    </LegalSection>

    <LegalSection title="Propriété intellectuelle">
      <p>
        Le nom Ticawa, son logo, la mascotte Tico et les contenus du site
        appartiennent à l'éditeur et ne peuvent être réutilisés sans son
        autorisation.
      </p>
    </LegalSection>

    <LegalSection title="Données personnelles">
      <p>
        Leur traitement est détaillé dans la
        <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink>.
      </p>
    </LegalSection>

    <LegalSection title="Modification des conditions">
      <p>
        Ces conditions peuvent évoluer avec le service. En cas de changement
        important, vous en serez informé dans l'application ou par email avant
        son entrée en vigueur.
      </p>
    </LegalSection>

    <LegalSection title="Droit applicable">
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        désaccord, une solution amiable sera recherchée en priorité en écrivant
        à
        <a href="mailto:perezalexandre430@gmail.com"
          >perezalexandre430@gmail.com</a
        >.
      </p>
      <p>
        À défaut, les tribunaux compétents seront saisis selon les règles de
        droit commun.
      </p>
    </LegalSection>
  </LegalPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation de Ticawa, le service gratuit qui conserve vos preuves d'achat et vous alerte avant l'expiration de vos garanties.",
});
</script>
