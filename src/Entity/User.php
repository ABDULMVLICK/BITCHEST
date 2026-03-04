<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /** @var string The hashed password */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    /** Token used for password reset (expires after 1 hour). */
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $resetToken = null;

    /** Expiration datetime for the reset token. */
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $resetTokenExpiresAt = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Wallet::class, orphanRemoval: true)]
    private Collection $wallets;

    public function __construct()
    {
        $this->wallets = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getUserIdentifier(): string { return (string) $this->email; }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): static { $this->password = $password; return $this; }

    public function eraseCredentials(): void {}

    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(string $firstName): static { $this->firstName = $firstName; return $this; }

    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(string $lastName): static { $this->lastName = $lastName; return $this; }

    public function getResetToken(): ?string { return $this->resetToken; }
    public function setResetToken(?string $resetToken): static { $this->resetToken = $resetToken; return $this; }

    public function getResetTokenExpiresAt(): ?\DateTimeImmutable { return $this->resetTokenExpiresAt; }
    public function setResetTokenExpiresAt(?\DateTimeImmutable $expiresAt): static { $this->resetTokenExpiresAt = $expiresAt; return $this; }

    /** Checks whether the reset token is still valid. */
    public function isResetTokenValid(): bool
    {
        return $this->resetToken !== null
            && $this->resetTokenExpiresAt !== null
            && $this->resetTokenExpiresAt > new \DateTimeImmutable();
    }

    /** @return Collection<int, Wallet> */
    public function getWallets(): Collection { return $this->wallets; }

    public function addWallet(Wallet $wallet): static
    {
        if (!$this->wallets->contains($wallet)) {
            $this->wallets->add($wallet);
            $wallet->setOwner($this);
        }
        return $this;
    }

    public function removeWallet(Wallet $wallet): static
    {
        if ($this->wallets->removeElement($wallet)) {
            if ($wallet->getOwner() === $this) {
                $wallet->setOwner(null);
            }
        }
        return $this;
    }
}
