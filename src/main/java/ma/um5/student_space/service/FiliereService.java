package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.model.FiliereDTO;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class FiliereService {

    private final FiliereRepository filiereRepository;
    private final ModuleeRepository moduleeRepository;
    private final StudentRepository studentRepository;

    public FiliereService(final FiliereRepository filiereRepository,
            final ModuleeRepository moduleeRepository, final StudentRepository studentRepository) {
        this.filiereRepository = filiereRepository;
        this.moduleeRepository = moduleeRepository;
        this.studentRepository = studentRepository;
    }

    public List<FiliereDTO> findAll() {
        final List<Filiere> filieres = filiereRepository.findAll(Sort.by("id"));
        return filieres.stream()
                .map(filiere -> mapToDTO(filiere, new FiliereDTO()))
                .toList();
    }

    public FiliereDTO get(final Integer id) {
        return filiereRepository.findById(id)
                .map(filiere -> mapToDTO(filiere, new FiliereDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final FiliereDTO filiereDTO) {
        final Filiere filiere = new Filiere();
        mapToEntity(filiereDTO, filiere);
        return filiereRepository.save(filiere).getId();
    }

    public void update(final Integer id, final FiliereDTO filiereDTO) {
        final Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(filiereDTO, filiere);
        filiereRepository.save(filiere);
    }

    public void delete(final Integer id) {
        filiereRepository.deleteById(id);
    }

    private FiliereDTO mapToDTO(final Filiere filiere, final FiliereDTO filiereDTO) {
        filiereDTO.setId(filiere.getId());
        filiereDTO.setName(filiere.getName());
        filiereDTO.setAcademicYear(filiere.getAcademicYear());
        filiereDTO.setDescription(filiere.getDescription());
        filiereDTO.setCreatedAt(filiere.getCreatedAt());
        return filiereDTO;
    }

    private Filiere mapToEntity(final FiliereDTO filiereDTO, final Filiere filiere) {
        filiere.setName(filiereDTO.getName());
        filiere.setAcademicYear(filiereDTO.getAcademicYear());
        filiere.setDescription(filiereDTO.getDescription());
        filiere.setCreatedAt(filiereDTO.getCreatedAt());
        return filiere;
    }

    public ReferencedWarning getReferencedWarning(final Integer id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Modulee filiereModulee = moduleeRepository.findFirstByFiliere(filiere);
        if (filiereModulee != null) {
            referencedWarning.setKey("filiere.modulee.filiere.referenced");
            referencedWarning.addParam(filiereModulee.getId());
            return referencedWarning;
        }
        final Student filiereStudent = studentRepository.findFirstByFiliere(filiere);
        if (filiereStudent != null) {
            referencedWarning.setKey("filiere.student.filiere.referenced");
            referencedWarning.addParam(filiereStudent.getApogeeNumber());
            return referencedWarning;
        }
        return null;
    }

}
