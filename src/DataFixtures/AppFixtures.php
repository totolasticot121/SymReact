<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur de mot de passe 
     * 
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
        
        for($k = 0; $k < 10; $k++)
        {
            $chrono = 1;
            $user = new User();
            $hash = $this->encoder->encodePassword($user, "password");
            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName())
                 ->setEmail($faker->email())
                 ->setPassword($hash);

            $manager->persist($user);

            for($i = 0; $i < mt_rand(5, 20); $i++)
            {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                         ->setLastName($faker->lastName())
                         ->setCompany($faker->company())
                         ->setEmail($faker->email())
                         ->setUser($user);
                        
                $manager->persist($customer);
    
                for($j = 0; $j < mt_rand(3, 10); $j++)
                {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(["Sent","Paid", "Cancel"]))
                            ->setChrono($chrono)
                            ->setCustomer($customer);
    
                    $chrono++;
                    $manager->persist($invoice);
    
                }
            }
        }

        $manager->flush();
    }
}
